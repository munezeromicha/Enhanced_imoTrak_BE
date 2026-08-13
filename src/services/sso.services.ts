import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';
import {
  extractBearerToken,
  SsoIdentity,
  verifySsoToken,
} from '../utils/sso-jwks';
import {
  mapAssignmentsToPositions,
  userPositionAssignmentsInclude,
} from '../utils/userPositions';
import { issuePositionSession } from './auth.services';

const prisma = new PrismaClient();

function autoProvisionEnabled(): boolean {
  const raw = (process.env.SSO_AUTO_PROVISION || 'true').trim().toLowerCase();
  return raw !== 'false' && raw !== '0' && raw !== 'no';
}

function splitName(identity: SsoIdentity): { first_name: string; last_name: string } {
  if (identity.name) {
    const parts = identity.name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return { first_name: parts[0], last_name: parts[0] };
    }
    return {
      first_name: parts[0],
      last_name: parts.slice(1).join(' '),
    };
  }
  const local = identity.email?.split('@')[0] || 'User';
  return { first_name: local, last_name: 'SSO' };
}

function mapGender(value?: string): 'MALE' | 'FEMALE' {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'female' || normalized === 'f') return 'FEMALE';
  return 'MALE';
}

function mapDob(value?: string): Date {
  if (value) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date('2000-01-01T00:00:00.000Z');
}

function placeholderFromSub(sub: string, prefix: string): string {
  const compact = sub.replace(/[^a-zA-Z0-9]/g, '').slice(0, 24) || 'user';
  return `${prefix}${compact}`;
}

export async function resolveSsoIdentity(params: {
  idToken?: string;
  accessToken?: string;
  authorization?: string;
}): Promise<SsoIdentity> {
  const bearer = extractBearerToken(params.authorization);
  const token = params.idToken || params.accessToken || bearer;
  if (!token) {
    throw new AppError('SSO token is required', 400);
  }

  try {
    const primary = await verifySsoToken(token);
    if (params.idToken && params.accessToken && params.accessToken !== params.idToken) {
      try {
        await verifySsoToken(params.accessToken);
      } catch {
        // Identity comes from the ID token; access token may use a different aud.
      }
    }
    return primary;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid SSO token';
    throw new AppError(message || 'Invalid or expired SSO token', 401);
  }
}

async function findAuthByIdentity(identity: SsoIdentity) {
  if (identity.email) {
    const byEmail = await prisma.tbl_auth.findUnique({
      where: { email: identity.email },
      include: {
        user: {
          include: userPositionAssignmentsInclude,
        },
      },
    });
    if (byEmail) return byEmail;
  }

  return prisma.tbl_auth.findUnique({
    where: { sso_sub: identity.sub },
    include: {
      user: {
        include: userPositionAssignmentsInclude,
      },
    },
  });
}

async function provisionSsoUser(identity: SsoIdentity) {
  if (!identity.email) {
    throw new AppError(
      'SSO login requires an email claim. Ask the SSO admin to grant the email scope.',
      400
    );
  }

  const { first_name, last_name } = splitName(identity);
  const user_nid = placeholderFromSub(identity.sub, 'sso-');
  const user_phone = identity.phone_number || placeholderFromSub(identity.sub, 'sso+');

  return prisma.$transaction(async (tx) => {
    const auth = await tx.tbl_auth.create({
      data: {
        email: identity.email,
        password: null,
        user_status: 'ACTIVE',
        is_verified: true,
        sso_sub: identity.sub,
      },
    });

    await tx.tbl_users.create({
      data: {
        first_name,
        last_name,
        user_nid,
        user_phone,
        user_gender: mapGender(identity.gender),
        user_dob: mapDob(identity.date_of_birth),
        user_photo: identity.picture,
        auth_id: auth.auth_id,
      },
    });

    return tx.tbl_auth.findUniqueOrThrow({
      where: { auth_id: auth.auth_id },
      include: {
        user: {
          include: userPositionAssignmentsInclude,
        },
      },
    });
  });
}

async function loadOrCreateSsoAuth(identity: SsoIdentity) {
  let auth = await findAuthByIdentity(identity);

  if (!auth) {
    if (!autoProvisionEnabled()) {
      throw new AppError(
        'No ImoTrak account exists for this University of Rwanda identity. Ask an administrator to create your user with this email.',
        403
      );
    }
    auth = await provisionSsoUser(identity);
  }

  if (auth.sso_sub !== identity.sub) {
    auth = await prisma.tbl_auth.update({
      where: { auth_id: auth.auth_id },
      data: { sso_sub: identity.sub, is_verified: true },
      include: {
        user: {
          include: userPositionAssignmentsInclude,
        },
      },
    });
  } else if (!auth.is_verified) {
    auth = await prisma.tbl_auth.update({
      where: { auth_id: auth.auth_id },
      data: { is_verified: true },
      include: {
        user: {
          include: userPositionAssignmentsInclude,
        },
      },
    });
  }

  if (auth.user_status !== 'ACTIVE') {
    throw new AppError('User is not active', 403);
  }

  if (!auth.user) {
    throw new AppError('User profile not found', 500);
  }

  return auth;
}

function mapPositions(auth: Awaited<ReturnType<typeof loadOrCreateSsoAuth>>) {
  const userPositions = mapAssignmentsToPositions(auth.user!);
  return userPositions.map((position) => ({
    position_id: position.position_id,
    position_name: position.position_name,
    unit_id: position.unit.unit_id,
    unit_name: position.unit.unit_name,
    organisation_id: position.unit.organization.organization_id,
    organization_name: position.unit.organization.organization_name,
  }));
}

export async function loginWithSso(params: {
  idToken?: string;
  accessToken?: string;
  authorization?: string;
}) {
  const identity = await resolveSsoIdentity(params);
  const auth = await loadOrCreateSsoAuth(identity);
  const positions = mapPositions(auth);

  if (positions.length === 0) {
    throw new AppError(
      'Your account has no ImoTrak position assigned. Please contact your administrator.',
      403
    );
  }

  return {
    positions,
    identity: {
      sub: identity.sub,
      name: identity.name,
      email: identity.email || auth.email,
      position: identity.position,
      unit_type: identity.unit_type,
      unit: identity.unit,
      role: identity.role,
      is_acting: identity.is_acting,
      acting_for: identity.acting_for,
    },
  };
}

export async function loginWithSsoPosition(params: {
  idToken?: string;
  accessToken?: string;
  authorization?: string;
  positionId: string;
}) {
  const identity = await resolveSsoIdentity(params);
  const auth = await loadOrCreateSsoAuth(identity);

  if (!auth.email) {
    throw new AppError('Account email is missing', 500);
  }

  return issuePositionSession(auth.user!.user_id, auth.email, params.positionId);
}
