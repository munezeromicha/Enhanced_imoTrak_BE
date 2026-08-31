import { OrgStatus, Prisma, PrismaClient, tbl_organizations } from '@prisma/client';
import { AppError } from '../utils/Error';
import {
  createUserPositionAssignment,
  enrichPositionResponse,
  mapAssignmentsToPositions,
  positionAssignmentsInclude,
  userHasPositionAssignment,
  userPositionAssignmentsInclude,
} from '../utils/userPositions';
import { AuthenticatedUser, position_accesses } from '../types/access';
import { clampPositionAccess, isPositionAccessSubset } from '../utils/positionAccessUtils';
import { INUMA_APPROVER_IMOTRAK_POSITION, normalizeCatalogName } from '../constants/inuma';
import { assertUnitInScope } from '../utils/campusScope';
import jwt from 'jsonwebtoken';
import {
  sendInvitationEmail,
  sendLeaderLoginMovedEmail,
} from '../utils/sendCredentials';
const prisma = new PrismaClient();

interface CreateOrgPayload {
  organization_name: string;
  organization_email: string;
  organization_phone: string;
  organization_customId: string;
  organization_logo: string;
  street_address: string;
  uses_reservations?: boolean;
  leader_unit_name?: string;
  leader_position_name?: string;
}

interface GetOrganizationsOptions {
  page?: number;
  limit?: number;
  status?: OrgStatus;
}

interface CreateUnitPayload {
  unit_name: string;
  organization_id: string;
}

interface GetPositionsInUnitPayload {
  unit_id: string;
  requesterOrgId: string;
  hasOrgViewAccess: boolean;
  user?: AuthenticatedUser;
}

interface GetOrgParams {
  organization_id: string;
  user: any;
}

interface GetUnitParams {
  unit_id: string;
  user: AuthenticatedUser;
}

interface UpdateUnitParams {
  unit_id: string;
  user: AuthenticatedUser;
  data: {
    unit_name: string;
  };
}

interface DeleteUnitParams {
  unit_id: string;
  user: AuthenticatedUser;
}

interface GetSinglePositionParams {
  position_id: string;
  user: AuthenticatedUser;
}

interface UpdatePositionParams {
  position_id: string;
  updateData: {
    position_name?: string;
    position_description?: string;
    position_access?: any;
  };
  user: AuthenticatedUser;
}

interface AssignUserToPositionParams {
  position_id: string;
  user_email: string;
  user: AuthenticatedUser;
}

export async function createOrganizationService(data: CreateOrgPayload) {
  const usesReservations = data.uses_reservations ?? true;
  const leaderUnitName = data.leader_unit_name?.trim() || 'Headquarters';
  const leaderPositionName = data.leader_position_name?.trim() || 'Organization Leader';

  const leaderAccess = buildLeaderPositionAccess(usesReservations);

  const result = await prisma.$transaction(async (tx) => {
    const newOrg = await tx.tbl_organizations.create({
      data: {
        organization_name: data.organization_name,
        organization_email: data.organization_email,
        organization_phone: data.organization_phone,
        organization_customId: data.organization_customId,
        organization_logo: data.organization_logo,
        street_address: data.street_address,
        organization_status: 'ACTIVE',
        uses_reservations: usesReservations,
      },
    });

    const leaderUnit = await tx.tbl_unit.create({
      data: {
        unit_name: leaderUnitName,
        organization_id: newOrg.organization_id,
        is_primary: true,
        status: 'ACTIVE',
      },
    });

    const leaderPosition = await tx.tbl_position.create({
      data: {
        position_name: leaderPositionName,
        position_description: 'Primary organization leader with elevated access',
        unit_id: leaderUnit.unit_id,
        is_org_leader: true,
        position_access: leaderAccess as unknown as Prisma.InputJsonValue,
        position_status: 'ACTIVE',
      },
    });

    const org = await tx.tbl_organizations.update({
      where: { organization_id: newOrg.organization_id },
      data: {
        leader_unit_id: leaderUnit.unit_id,
        leader_position_id: leaderPosition.position_id,
      },
    });

    return { org, leaderUnit, leaderPosition };
  });

  return result.org;
}

function buildLeaderPositionAccess(usesReservations: boolean): position_accesses {
  const noReservations = {
    create: false,
    view: false,
    update: false,
    delete: false,
    cancel: false,
    approve: false,
    assignVehicle: false,
    odometerFuel: false,
    start: false,
    complete: false,
    viewOwn: false,
    viewAssigned: false,
    updateReason: false,
  };

  const fullReservations = {
    create: true,
    view: true,
    update: true,
    delete: true,
    cancel: true,
    approve: true,
    assignVehicle: true,
    odometerFuel: true,
    start: true,
    complete: true,
    viewOwn: true,
    viewAssigned: true,
    updateReason: true,
  };

  return {
    // Organizations module is hub SuperAdmin only — org leaders manage units/users/fleet, not orgs.
    organizations: { create: false, view: false, update: false, delete: false },
    units: { create: true, view: true, update: true, delete: true },
    positions: { create: true, view: true, update: true, delete: true, assignUser: true },
    users: { create: true, view: true, update: true, delete: true },
    vehicleModels: { create: false, view: true, viewSingle: true, update: false, delete: false },
    vehicles: { create: true, view: true, viewSingle: true, update: true, delete: true },
    reservations: usesReservations ? fullReservations : noReservations,
    vehicleIssues: { report: true, view: true, viewOwn: true, update: true, delete: true },
    fuel: {
      request: true,
      view: true,
      viewOwn: true,
      recommend: true,
      confirmFunding: true,
      issue: true,
      receive: true,
      replenish: true,
      viewReport: true,
      manageGenerators: true,
    },
  };
}

export async function getOrganizationsService({ page = 1, limit = 10, status }: GetOrganizationsOptions) {
  const whereClause = status ? { organization_status: status } : {};

  const [organizations, total] = await Promise.all([
    prisma.tbl_organizations.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' }
    }),
    prisma.tbl_organizations.count({ where: whereClause })
  ]);

  return {
    organizations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  };
}

export async function createUnitService(data: CreateUnitPayload) {
  const newUnit = await prisma.tbl_unit.create({
    data,
  });
  return newUnit;
}

export async function createPositionService(data: {
  position_name: string;
  position_description: string;
  unit_id: string;
  position_access: any;
}) {
  const position = await prisma.tbl_position.create({
    data,
  });
  return position;
}

// The SuperAdmin role is the protected hub-admin position. It must never be
// deactivated/deleted because doing so would lock everyone out of admin work.
const PROTECTED_POSITION_NAME = 'superadmin';

export function isProtectedSuperAdminPosition(positionName: string | null | undefined) {
  return (positionName ?? '').trim().toLowerCase() === PROTECTED_POSITION_NAME;
}

export async function softDeletePositionService(positionId: string, userId: string, userAccess: any) {
  if (!userAccess?.positions?.delete) {
    throw new AppError('You do not have permission to delete positions', 403);
  }

  const position = await prisma.tbl_position.findUnique({
    where: { position_id: positionId },
    include: {
      unit: true,
    },
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }

  if (isProtectedSuperAdminPosition(position.position_name)) {
    throw new AppError('The SuperAdmin position cannot be archived or deleted', 403);
  }

  if (normalizeCatalogName(position.position_name) === normalizeCatalogName(INUMA_APPROVER_IMOTRAK_POSITION)) {
    throw new AppError('The Assets & Services Administrator position cannot be archived', 403);
  }

  // Get the requesting user's organization
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: userId },
    include: userPositionAssignmentsInclude,
  });

  const userPositions = user ? mapAssignmentsToPositions(user) : [];
  const userOrgId = userPositions[0]?.unit?.organization_id;
  const isHubSuperAdmin = !!userAccess?.organizations?.create;

  if (!isHubSuperAdmin && position.unit.organization_id !== userOrgId) {
    throw new AppError('You are not allowed to archive positions from another organization', 403);
  }

  if (position.position_status === 'INACTIVE') {
    throw new AppError('Position is already archived', 400);
  }

  const assignmentCount = await prisma.tbl_user_position_assignments.count({
    where: { position_id: positionId },
  });

  await prisma.$transaction(async (tx) => {
    await tx.tbl_position.update({
      where: { position_id: positionId },
      data: {
        position_status: 'INACTIVE',
      },
    });

    // Releasing the holders is part of deleting the position. Leaving the
    // assignments behind kept deleted positions attached to their unit and let
    // users carry a position that no longer exists.
    await tx.tbl_user_position_assignments.deleteMany({
      where: { position_id: positionId },
    });

    await tx.tbl_auth.updateMany({
      where: { matched_position_id: positionId },
      data: { matched_position_id: null },
    });
  }, WRITE_TX_OPTIONS);

  return {
    message: 'Position archived successfully',
    position_id: positionId,
    users_unassigned: assignmentCount,
  };
}

export async function getPositionsInUnitService({
  unit_id,
  requesterOrgId,
  hasOrgViewAccess,
  user,
}: GetPositionsInUnitPayload) {
  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id: unit_id },
    include: { organization: true },
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }

  if (!hasOrgViewAccess && unit.organization_id !== requesterOrgId) {
    throw new AppError('Access denied: Unit is outside your organization', 403);
  }

  assertUnitInScope(user, unit_id, 'view positions for');

  const positions = await prisma.tbl_position.findMany({
    where: { unit_id: unit_id, position_status: 'ACTIVE' },
    include: positionAssignmentsInclude,
  });

  return positions.map(enrichPositionResponse);
}

/**
 * @param campusUnitId When set, the caller may only see this one unit — an
 *   Inuma user is pinned to the campus they signed in from.
 */
/**
 * Copies existing positions into a unit, using them as templates.
 *
 * A position row belongs to exactly one unit (`@@unique([position_name, unit_id])`),
 * so "adding" an existing position means duplicating its name, description and
 * permissions into the target unit. Names already present in the unit are
 * skipped rather than treated as errors, which keeps the action repeatable.
 *
 * Sources may come from any organization the requester can already see — a role
 * like "Accountant" is a template, not shared state. The copy becomes a new row
 * owned by the target unit, so no data crosses an organization boundary. The
 * boundaries that do matter are enforced below: the target unit must be yours
 * (or you must be a hub admin), and the copied permissions are clamped to what
 * you hold yourself.
 */
export async function addExistingPositionsToUnitService({
  unit_id,
  position_ids,
  user,
}: {
  unit_id: string;
  position_ids: string[];
  user: AuthenticatedUser;
}) {
  if (!position_ids?.length) {
    throw new AppError('Select at least one position to add', 400);
  }

  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
    include: { organization: true },
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }

  const isSuperUser = !!user.position_access?.organizations?.create;
  if (!isSuperUser && unit.organization_id !== user.organization_id) {
    throw new AppError('You can only add positions to units in your organization', 403);
  }

  assertUnitInScope(user, unit_id, 'add positions to');

  const sources = await prisma.tbl_position.findMany({
    where: {
      position_id: { in: position_ids },
      position_status: 'ACTIVE',
    },
    include: { unit: true },
  });

  if (sources.length === 0) {
    throw new AppError('No active positions found for the selected ids', 404);
  }

  // Hub admins browse every organization's positions and may template from any
  // of them. Everyone else only ever sees their own organization's list, so
  // sources are held to that — a hand-crafted id must not reveal a name and
  // description from a tenant the caller cannot otherwise see.
  if (!isSuperUser) {
    const outsider = sources.find(
      (position) => position.unit.organization_id !== unit.organization_id
    );
    if (outsider) {
      throw new AppError(
        'A selected position belongs to another organization',
        400
      );
    }
  }

  // When the same role name exists in several organizations, prefer the target
  // organization's own copy so its permission template wins.
  sources.sort((a, b) => {
    const aLocal = a.unit.organization_id === unit.organization_id ? 0 : 1;
    const bLocal = b.unit.organization_id === unit.organization_id ? 0 : 1;
    return aLocal - bLocal;
  });

  const existing = await prisma.tbl_position.findMany({
    where: { unit_id },
    select: { position_id: true, position_name: true, position_status: true },
  });
  const existingByName = new Map(
    existing.map((position) => [normalizeCatalogName(position.position_name), position])
  );

  const added: string[] = [];
  const reactivated: string[] = [];
  const skipped: string[] = [];
  const reactivateIds: string[] = [];
  const toCreate: Prisma.tbl_positionCreateManyInput[] = [];
  // Two source rows can carry the same role name from different units; the
  // unit can only hold one, so the first wins and the rest are skipped.
  const claimedNames = new Set<string>();

  for (const source of sources) {
    const normalized = normalizeCatalogName(source.position_name);

    if (source.unit_id === unit_id || claimedNames.has(normalized)) {
      skipped.push(source.position_name);
      continue;
    }

    const match = existingByName.get(normalized);
    if (match) {
      if (match.position_status === 'ACTIVE') {
        skipped.push(source.position_name);
      } else {
        reactivateIds.push(match.position_id);
        reactivated.push(source.position_name);
        claimedNames.add(normalized);
      }
      continue;
    }

    // Copying must not hand out permissions the requester lacks.
    const access = clampPositionAccess(
      user.position_access,
      source.position_access as unknown as position_accesses
    );

    toCreate.push({
      position_name: source.position_name,
      position_description: source.position_description,
      position_access: access as unknown as Prisma.InputJsonValue,
      unit_id,
      position_status: 'ACTIVE',
    });
    added.push(source.position_name);
    claimedNames.add(normalized);
  }

  // Batched so adding the whole catalog at once stays a couple of statements
  // rather than one round trip per position.
  if (reactivateIds.length > 0 || toCreate.length > 0) {
    await prisma.$transaction(async (tx) => {
      if (reactivateIds.length > 0) {
        await tx.tbl_position.updateMany({
          where: { position_id: { in: reactivateIds } },
          data: { position_status: 'ACTIVE' },
        });
      }
      if (toCreate.length > 0) {
        await tx.tbl_position.createMany({
          data: toCreate,
          skipDuplicates: true,
        });
      }
    });
  }

  const positions = await prisma.tbl_position.findMany({
    where: { unit_id, position_status: 'ACTIVE' },
    include: positionAssignmentsInclude,
  });

  return {
    added_count: added.length,
    reactivated_count: reactivated.length,
    skipped_count: skipped.length,
    added,
    reactivated,
    skipped,
    positions: positions.map(enrichPositionResponse),
  };
}

export async function getUnitsService(
  organization_id?: string,
  campusUnitId?: string,
  status: OrgStatus = 'ACTIVE'
) {
  const units = await prisma.tbl_unit.findMany({
    where: {
      ...(organization_id ? { organization_id } : {}),
      ...(campusUnitId ? { unit_id: campusUnitId } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      positions: true,
    },
    orderBy: { created_at: 'desc' },
  });
  return units;
}

export const getSingleOrganizationService = async ({ organization_id, user }: GetOrgParams) => {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id },
    include: {
      units: true
    }
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  return organization;
};

export type LeaderAccountSync =
  | { action: 'unchanged' }
  | { action: 'login_moved'; email: string; previous_email: string | null }
  | { action: 'leader_invited'; email: string };

/** Placeholder for the unique columns on a provisioned leader profile. */
function leaderPlaceholder(organizationId: string, prefix: string): string {
  const compact = organizationId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20) || 'org';
  return `${prefix}${compact}`;
}

/**
 * Resolve the position that represents leadership of an organization.
 *
 * Organizations created by `createOrganizationService` always carry
 * `leader_position_id`. Older rows may not, so fall back to any active
 * `is_org_leader` position inside the organization, and create the unit and
 * position if the organization has neither.
 */
/**
 * Read-only lookup of the position representing leadership of an organization.
 *
 * Organizations created by `createOrganizationService` always carry
 * `leader_position_id`. Older rows may not, so fall back to any active
 * `is_org_leader` position inside the organization. Returns null when the
 * organization has neither — `createLeaderPosition` builds one.
 */
async function findLeaderPosition(organization: tbl_organizations) {
  if (organization.leader_position_id) {
    const position = await prisma.tbl_position.findUnique({
      where: { position_id: organization.leader_position_id },
      include: { unit: true },
    });
    if (position) return position;
  }

  return prisma.tbl_position.findFirst({
    where: {
      is_org_leader: true,
      position_status: 'ACTIVE',
      unit: { organization_id: organization.organization_id },
    },
    include: { unit: true },
  });
}

/** Build the leader unit and position for a legacy organization that has none. */
async function createLeaderPosition(
  tx: Prisma.TransactionClient,
  organization: tbl_organizations,
  existingPrimaryUnitId: string | null
) {
  const leaderUnitId =
    existingPrimaryUnitId ??
    (
      await tx.tbl_unit.create({
        data: {
          unit_name: 'Headquarters',
          organization_id: organization.organization_id,
          is_primary: true,
          status: 'ACTIVE',
        },
      })
    ).unit_id;

  const leaderPosition = await tx.tbl_position.create({
    data: {
      position_name: 'Organization Leader',
      position_description: 'Primary organization leader with elevated access',
      unit_id: leaderUnitId,
      is_org_leader: true,
      position_access: buildLeaderPositionAccess(
        organization.uses_reservations ?? true
      ) as unknown as Prisma.InputJsonValue,
      position_status: 'ACTIVE',
    },
  });

  await tx.tbl_organizations.update({
    where: { organization_id: organization.organization_id },
    data: {
      leader_unit_id: leaderUnitId,
      leader_position_id: leaderPosition.position_id,
    },
  });

  return leaderPosition;
}

/**
 * Keep the organization's leader login in step with its email address.
 *
 * `organization_email` used to be a contact field with no relationship to any
 * login, so changing it left the new address unable to sign in ("Account not
 * found") while the old one silently kept working. This closes that gap:
 *
 *  - a leader account already exists → its login email moves to the new
 *    address, keeping the existing password so the leader can sign in at once.
 *    The old address stops working immediately.
 *  - no leader account exists yet → one is provisioned against the
 *    organization's leader position and invited to set a password.
 *
 * The new address must be free; handing an organization an email that already
 * belongs to somebody else would hijack that person's account.
 */
/**
 * A decided sync, ready to execute.
 *
 * Every lookup the decision needs happens before the transaction opens.
 * Postgres closes an interactive transaction after 5s by default, and on a
 * pooled/serverless database each round trip is slow enough that doing the
 * reads inside the transaction expired it before the writes ran.
 */
type LeaderSyncPlan =
  | { kind: 'unchanged' }
  | { kind: 'move'; authId: string; email: string; previousEmail: string | null }
  | {
      kind: 'provision';
      email: string;
      leaderPositionId: string | null;
      primaryUnitId: string | null;
    };

/** All reads for a leader sync — safe to run outside a transaction. */
async function planLeaderAccountSync(
  organization: tbl_organizations,
  newEmail: string
): Promise<LeaderSyncPlan> {
  const email = newEmail.trim().toLowerCase();

  const leaderPosition = await findLeaderPosition(organization);

  const assignment = leaderPosition
    ? await prisma.tbl_user_position_assignments.findFirst({
        where: { position_id: leaderPosition.position_id },
        include: { user: { include: { auth: true } } },
        orderBy: { assignment_id: 'asc' },
      })
    : null;
  const currentAuth = assignment?.user?.auth ?? null;

  const emailOwner = await prisma.tbl_auth.findUnique({ where: { email } });
  if (emailOwner && emailOwner.auth_id !== currentAuth?.auth_id) {
    throw new AppError(
      `${email} is already used by another ImoTrak account. Use an address that is not yet registered, or reassign that account first.`,
      409
    );
  }

  // The leader already signs in — move the login to the new address.
  if (currentAuth) {
    if (currentAuth.email?.toLowerCase() === email) {
      return { kind: 'unchanged' };
    }
    return {
      kind: 'move',
      authId: currentAuth.auth_id,
      email,
      previousEmail: currentAuth.email,
    };
  }

  // Nobody holds the leader position yet — provision the account. Look up the
  // primary unit now so the transaction never has to.
  const primaryUnit = leaderPosition
    ? null
    : await prisma.tbl_unit.findFirst({
        where: { organization_id: organization.organization_id, is_primary: true },
        select: { unit_id: true },
      });

  return {
    kind: 'provision',
    email,
    leaderPositionId: leaderPosition?.position_id ?? null,
    primaryUnitId: primaryUnit?.unit_id ?? null,
  };
}

/** All writes for a leader sync — runs inside the caller's transaction. */
async function applyLeaderAccountSync(
  tx: Prisma.TransactionClient,
  organization: tbl_organizations,
  plan: LeaderSyncPlan
): Promise<LeaderAccountSync> {
  if (plan.kind === 'unchanged') {
    return { action: 'unchanged' };
  }

  if (plan.kind === 'move') {
    await tx.tbl_auth.update({
      where: { auth_id: plan.authId },
      data: { email: plan.email, updated_at: new Date() },
    });
    return {
      action: 'login_moved',
      email: plan.email,
      previous_email: plan.previousEmail,
    };
  }

  const leaderPositionId =
    plan.leaderPositionId ??
    (await createLeaderPosition(tx, organization, plan.primaryUnitId)).position_id;

  const auth = await tx.tbl_auth.create({
    data: {
      email: plan.email,
      password: null,
      user_status: 'ACTIVE',
      is_verified: false,
    },
  });

  const user = await tx.tbl_users.create({
    data: {
      first_name: organization.organization_name.slice(0, 40) || 'Organization',
      last_name: 'Leader',
      user_nid: leaderPlaceholder(organization.organization_id, 'org-'),
      user_phone: leaderPlaceholder(organization.organization_id, 'org+'),
      user_gender: 'MALE',
      user_dob: new Date('2000-01-01T00:00:00.000Z'),
      auth_id: auth.auth_id,
    },
  });

  await createUserPositionAssignment(tx, user.user_id, leaderPositionId);

  return { action: 'leader_invited', email: plan.email };
}

/**
 * Interactive transactions carrying several writes need more than the 5s
 * default when the database is pooled or serverless.
 */
const WRITE_TX_OPTIONS = { timeout: 30_000, maxWait: 15_000 } as const;

/** Invite a freshly provisioned org leader to set their password. */
async function sendOrganizationLeaderInvitation(
  organization: tbl_organizations,
  email: string
) {
  const jwtSecret = process.env.JWT_SECRET as string;
  if (!jwtSecret) {
    throw new Error('JWT secret is not defined');
  }
  const expiresIn = (process.env.VERIFY_LINK_EXPIRES_IN ||
    '1h') as jwt.SignOptions['expiresIn'];

  const leaderPosition = organization.leader_position_id
    ? await prisma.tbl_position.findUnique({
        where: { position_id: organization.leader_position_id },
        include: { unit: true },
      })
    : null;

  await sendInvitationEmail(
    email,
    jwt.sign({ email }, jwtSecret, { expiresIn }),
    leaderPosition?.position_name ?? 'Organization Leader',
    leaderPosition?.unit.unit_name ?? 'Headquarters',
    organization.organization_name
  );
}

/** Tell the old and new addresses that the leader login has moved. */
async function notifyLeaderLoginMoved(
  organization: tbl_organizations,
  newEmail: string,
  previousEmail: string | null
) {
  await sendLeaderLoginMovedEmail({
    newEmail,
    previousEmail,
    organizationName: organization.organization_name,
  });
}

export const updateOrganizationService = async ({
  organization_id,
  updates
}: {
  organization_id: string;
  updates: Partial<tbl_organizations>;
}) => {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id }
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  // Ensure status is not updated
  if ('status' in updates) {
    delete updates.status;
  }

  const requestedEmail =
    typeof updates.organization_email === 'string'
      ? updates.organization_email.trim().toLowerCase()
      : undefined;
  const emailChanged =
    !!requestedEmail &&
    requestedEmail !== organization.organization_email?.trim().toLowerCase();

  // Decide before opening the transaction, so it carries writes only.
  const plan: LeaderSyncPlan = emailChanged
    ? await planLeaderAccountSync(organization, requestedEmail!)
    : { kind: 'unchanged' };

  const { updatedOrg, leaderSync } = await prisma.$transaction(async (tx) => {
    const leaderSync = await applyLeaderAccountSync(tx, organization, plan);

    const updatedOrg = await tx.tbl_organizations.update({
      where: { organization_id },
      data: {
        ...updates,
        ...(requestedEmail ? { organization_email: requestedEmail } : {}),
      },
    });

    return { updatedOrg, leaderSync };
  }, WRITE_TX_OPTIONS);

  await announceLeaderAccountSync(updatedOrg, leaderSync);

  return { ...updatedOrg, leader_account: leaderSync };
};

/**
 * Email delivery is best-effort: the login change is already committed, and
 * failing the request here would hide a successful update.
 */
async function announceLeaderAccountSync(
  organization: tbl_organizations,
  leaderSync: LeaderAccountSync
) {
  if (leaderSync.action === 'leader_invited') {
    try {
      await sendOrganizationLeaderInvitation(organization, leaderSync.email);
    } catch (error) {
      console.error('Failed to send organization leader invitation:', error);
    }
  } else if (leaderSync.action === 'login_moved') {
    try {
      await notifyLeaderLoginMoved(
        organization,
        leaderSync.email,
        leaderSync.previous_email
      );
    } catch (error) {
      console.error('Failed to send leader login change notice:', error);
    }
  }
}

/**
 * Bring one organization's leader login in line with its current email without
 * changing the email itself.
 *
 * Repairs organizations whose address was edited before the sync existed — the
 * new address was written to the organization but no account was ever created
 * for it, so signing in reported "Account not found".
 */
export async function ensureOrganizationLeaderAccount(
  organization_id: string
): Promise<LeaderAccountSync> {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id },
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  if (!organization.organization_email?.trim()) {
    throw new AppError('Organization has no email address to sync', 400);
  }

  const plan = await planLeaderAccountSync(
    organization,
    organization.organization_email
  );

  const leaderSync = await prisma.$transaction(
    (tx) => applyLeaderAccountSync(tx, organization, plan),
    WRITE_TX_OPTIONS
  );

  await announceLeaderAccountSync(organization, leaderSync);

  return leaderSync;
}

export const deleteOrganizationService = async ({
  organization_id,
}: {
  organization_id: string;
}) => {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id }
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  if (organization.organization_status === 'INACTIVE') {
    throw new AppError('Organization is already archived', 400);
  }

  // Get all unit_ids for the organization
  const units = await prisma.tbl_unit.findMany({
    where: { organization_id },
    select: { unit_id: true }
  });
  const unitIds = units.map((unit) => unit.unit_id);

  // Perform soft delete in a transaction
  await prisma.$transaction([
    prisma.tbl_organizations.update({
      where: { organization_id },
      data: { organization_status: 'INACTIVE' }
    }),
    prisma.tbl_unit.updateMany({
      where: { organization_id },
      data: { status: 'INACTIVE' }
    }),
    prisma.tbl_position.updateMany({
      where: { unit_id: { in: unitIds } },
      data: { position_status: 'INACTIVE' }
    })
  ]);
};

/**
 * Permanently erases an organization and everything belonging to it: units,
 * positions, vehicles and their trip/issue/maintenance history, plus the
 * accounts of people who work only for this organization.
 *
 * Someone holding a position in another organization as well keeps their
 * account — only their assignments to this organization are removed — so
 * deleting one tenant can never orphan another.
 *
 * This is irreversible; `deleteOrganizationService` remains the soft-delete.
 */
export async function deleteOrganizationPermanentlyService({
  organization_id,
  actorUserId,
}: {
  organization_id: string;
  actorUserId: string;
}) {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id },
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  const units = await prisma.tbl_unit.findMany({
    where: { organization_id },
    select: { unit_id: true },
  });
  const unitIds = units.map((unit) => unit.unit_id);

  const positions = await prisma.tbl_position.findMany({
    where: { unit_id: { in: unitIds } },
    select: { position_id: true },
  });
  const positionIds = positions.map((position) => position.position_id);

  // Members of this organization, split by whether they also work elsewhere.
  const members = await prisma.tbl_users.findMany({
    where: {
      position_assignments: { some: { position_id: { in: positionIds } } },
    },
    select: {
      user_id: true,
      auth_id: true,
      position_assignments: {
        select: { position: { select: { unit_id: true } } },
      },
    },
  });

  const exclusiveMembers = members.filter((member) =>
    member.position_assignments.every((assignment) =>
      unitIds.includes(assignment.position.unit_id)
    )
  );

  if (exclusiveMembers.some((member) => member.user_id === actorUserId)) {
    throw new AppError(
      'You cannot delete the organization your own account belongs to',
      400
    );
  }

  const userIds = exclusiveMembers.map((member) => member.user_id);
  const authIds = exclusiveMembers.map((member) => member.auth_id);

  const vehicles = await prisma.tbl_vehicles.findMany({
    where: { organization_id },
    select: { vehicle_id: true },
  });
  const vehicleIds = vehicles.map((vehicle) => vehicle.vehicle_id);

  // Reservations reachable from this organization: booked by a departing member
  // or made against one of its vehicles.
  const reservations = await prisma.tbl_reservations.findMany({
    where: {
      OR: [
        ...(userIds.length ? [{ user_id: { in: userIds } }] : []),
        ...(vehicleIds.length
          ? [{ reserved_vehicles: { some: { vehicle_id: { in: vehicleIds } } } }]
          : []),
      ],
    },
    select: { reservation_id: true },
  });
  const reservationIds = reservations.map((r) => r.reservation_id);

  const reservedRows =
    reservationIds.length || vehicleIds.length
      ? await prisma.tbl_reserved_vehicles.findMany({
          where: {
            OR: [
              ...(reservationIds.length
                ? [{ reservation_id: { in: reservationIds } }]
                : []),
              ...(vehicleIds.length ? [{ vehicle_id: { in: vehicleIds } }] : []),
            ],
          },
          select: { reserved_vehicle_id: true },
        })
      : [];
  const reservedIds = reservedRows.map((r) => r.reserved_vehicle_id);

  const issueIds = reservedIds.length
    ? (
        await prisma.tbl_vehicle_issues.findMany({
          where: { reserved_vehicle_id: { in: reservedIds } },
          select: { issue_id: true },
        })
      ).map((issue) => issue.issue_id)
    : [];

  const drivers = userIds.length
    ? await prisma.tbl_drivers.findMany({
        where: { user_id: { in: userIds } },
        select: { driver_id: true },
      })
    : [];
  const driverIds = drivers.map((driver) => driver.driver_id);

  const maintenanceIds = (
    await prisma.tbl_vehicle_maintenance.findMany({
      where: {
        OR: [
          ...(vehicleIds.length ? [{ vehicle_id: { in: vehicleIds } }] : []),
          ...(userIds.length ? [{ created_by_user_id: { in: userIds } }] : []),
        ],
      },
      select: { maintenance_id: true },
    })
  ).map((record) => record.maintenance_id);

  try {
    await prisma.$transaction(
      async (tx) => {
        // 1) Drop the organization's own pointers so nothing blocks the delete.
        await tx.tbl_organizations.update({
          where: { organization_id },
          data: { leader_unit_id: null, leader_position_id: null },
        });

        // 2) Maintenance (supervisors first — they reference users).
        if (maintenanceIds.length) {
          await tx.tbl_vehicle_maintenance_supervisors.deleteMany({
            where: { maintenance_id: { in: maintenanceIds } },
          });
          await tx.tbl_vehicle_maintenance.deleteMany({
            where: { maintenance_id: { in: maintenanceIds } },
          });
        }
        if (userIds.length) {
          await tx.tbl_vehicle_maintenance_supervisors.deleteMany({
            where: { user_id: { in: userIds } },
          });
        }

        // 3) Break the self-references among reserved vehicles and issues.
        if (reservedIds.length) {
          await tx.tbl_vehicle_issues.updateMany({
            where: { replacement_reserved_vehicle_id: { in: reservedIds } },
            data: { replacement_reserved_vehicle_id: null },
          });
          await tx.tbl_reserved_vehicles.updateMany({
            where: { replaced_by_id: { in: reservedIds } },
            data: { replaced_by_id: null },
          });
          await tx.tbl_reserved_vehicles.updateMany({
            where: { reserved_vehicle_id: { in: reservedIds } },
            data: { replaced_by_id: null },
          });
        }

        // 4) Issues and their replies.
        if (issueIds.length) {
          await tx.tbl_vehicle_issue_replies.deleteMany({
            where: { issue_id: { in: issueIds } },
          });
        }
        if (driverIds.length) {
          await tx.tbl_vehicle_issue_replies.deleteMany({
            where: { driver_id: { in: driverIds } },
          });
          await tx.tbl_vehicle_issues.updateMany({
            where: { reported_by_driver_id: { in: driverIds } },
            data: { reported_by_driver_id: null },
          });
        }
        if (userIds.length) {
          await tx.tbl_vehicle_issue_replies.updateMany({
            where: { user_id: { in: userIds } },
            data: { user_id: null },
          });
          await tx.tbl_vehicle_issues.updateMany({
            where: { issue_responder: { in: userIds } },
            data: { issue_responder: null },
          });
          await tx.tbl_vehicle_issues.updateMany({
            where: { reported_by_user_id: { in: userIds } },
            data: { reported_by_user_id: null },
          });
        }
        if (issueIds.length) {
          await tx.tbl_vehicle_issues.deleteMany({
            where: { issue_id: { in: issueIds } },
          });
        }

        // 5) Trip records.
        if (reservedIds.length) {
          await tx.tbl_reserved_vehicle_drivers.deleteMany({
            where: { reserved_vehicle_id: { in: reservedIds } },
          });
          await tx.tbl_vehicle_locations.deleteMany({
            where: { reserved_vehicle_id: { in: reservedIds } },
          });
        }
        if (driverIds.length) {
          await tx.tbl_reserved_vehicle_drivers.deleteMany({
            where: { driver_id: { in: driverIds } },
          });
        }
        if (vehicleIds.length) {
          await tx.tbl_vehicle_locations.deleteMany({
            where: { vehicle_id: { in: vehicleIds } },
          });
        }
        if (reservedIds.length) {
          await tx.tbl_reserved_vehicles.deleteMany({
            where: { reserved_vehicle_id: { in: reservedIds } },
          });
        }

        // 6) Reservations — clear reviewer/approver links held by leavers first.
        if (userIds.length) {
          await tx.tbl_reservations.updateMany({
            where: { approved_by: { in: userIds } },
            data: { approved_by: null },
          });
          await tx.tbl_reservations.updateMany({
            where: { canceled_by: { in: userIds } },
            data: { canceled_by: null },
          });
          await tx.tbl_reservations.updateMany({
            where: { completed_by: { in: userIds } },
            data: { completed_by: null },
          });
          await tx.tbl_reservations.updateMany({
            where: { reviewed_by: { in: userIds } },
            data: { reviewed_by: null },
          });
        }
        if (reservationIds.length) {
          await tx.tbl_reservations.deleteMany({
            where: { reservation_id: { in: reservationIds } },
          });
        }

        // 7) Vehicles (gps devices cascade) and organization vehicle types.
        if (vehicleIds.length) {
          await tx.tbl_vehicles.deleteMany({
            where: { vehicle_id: { in: vehicleIds } },
          });
        }
        await tx.tbl_vehicle_types.deleteMany({ where: { organization_id } });

        // 8) Driver profiles of departing members.
        if (driverIds.length) {
          await tx.tbl_drivers.deleteMany({
            where: { driver_id: { in: driverIds } },
          });
        }

        // 9) Position assignments: everything in this organization, which also
        //    releases members who stay because they work elsewhere too.
        if (positionIds.length) {
          await tx.tbl_user_position_assignments.deleteMany({
            where: { position_id: { in: positionIds } },
          });
        }

        // 10) Departing members' logs, notifications and sessions.
        if (userIds.length) {
          await tx.tbl_audit_logs.deleteMany({ where: { user_id: { in: userIds } } });
          await tx.tbl_notifications.deleteMany({
            where: { user_id: { in: userIds } },
          });
          await tx.tbl_jwt_blacklist.deleteMany({
            where: { user_id: { in: userIds } },
          });
          await tx.tbl_users.updateMany({
            where: { updated_by_user_id: { in: userIds } },
            data: { updated_by_user_id: null },
          });
          await tx.tbl_users.deleteMany({ where: { user_id: { in: userIds } } });
          await tx.tbl_auth.deleteMany({ where: { auth_id: { in: authIds } } });
        }

        // 11) Finally the structure itself.
        if (positionIds.length) {
          await tx.tbl_position.deleteMany({
            where: { position_id: { in: positionIds } },
          });
        }
        await tx.tbl_unit.deleteMany({ where: { organization_id } });
        await tx.tbl_organizations.delete({ where: { organization_id } });
      },
      { maxWait: 15_000, timeout: 120_000 }
    );
  } catch (error: unknown) {
    const prismaError = error as { code?: string; message?: string };
    if (prismaError?.code === 'P2003') {
      throw new AppError(
        'Cannot delete organization: related records still reference it.',
        409
      );
    }
    if (
      prismaError?.code === 'P2028' ||
      prismaError?.message?.includes('Transaction already closed')
    ) {
      throw new AppError('Organization delete timed out. Please try again.', 504);
    }
    throw error;
  }

  return {
    organization_id,
    organization_name: organization.organization_name,
    deleted_units: unitIds.length,
    deleted_positions: positionIds.length,
    deleted_vehicles: vehicleIds.length,
    deleted_users: userIds.length,
    released_users: members.length - userIds.length,
  };
}

export const getSingleUnitService = async ({ unit_id, user }: GetUnitParams) => {
  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
    include: {
      positions: true
    }
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }
  const isOwnOrg = unit.organization_id === user.organization_id;
  const isSuperUser = user.position_access?.organizations.create;
  if (!isOwnOrg && !isSuperUser) {
    throw new AppError('You do not have permission to access this unit', 403);
  }

  assertUnitInScope(user, unit_id, 'view');

  return unit;
};

export const updateUnitService = async ({ unit_id, user, data }: UpdateUnitParams) => {
  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }

  const userOrgId = user.organization_id;

  if (!userOrgId || unit.organization_id !== userOrgId && !user.position_access?.organizations.create) {
    throw new AppError('You can only update units within your organization', 403);
  }

  assertUnitInScope(user, unit_id, 'update');

  const updatedUnit = await prisma.tbl_unit.update({
    where: { unit_id },
    data: {
      unit_name: data.unit_name,
    },
  });

  return updatedUnit;
};

export const deleteUnitService = async ({ unit_id, user }: DeleteUnitParams) => {
  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
    include: { organization: true }
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }

  const userOrgId = user.organization_id;

  assertUnitInScope(user, unit_id, 'delete');

  if (!user.position_access.organizations?.create && unit.organization_id !== userOrgId) {
    throw new AppError('You can only delete units within your organization', 403);
  }

  if (unit.status === 'INACTIVE') {
    throw new AppError('Unit is already archived', 400);
  }

  // UR-Fleet used to be blocked by name because deleting it left Inuma users
  // pointing at a dead unit. Deletion now clears those pointers, so the name
  // no longer needs protecting — only genuinely structural units do.
  if (unit.organization.leader_unit_id === unit_id) {
    throw new AppError(
      'This unit holds the organization leader position. Move the leader to another unit before deleting it.',
      409
    );
  }

  const activeUnitCount = await prisma.tbl_unit.count({
    where: { organization_id: unit.organization_id, status: 'ACTIVE' },
  });
  if (activeUnitCount <= 1) {
    throw new AppError(
      'This is the only active unit in the organization. Create another unit before deleting this one.',
      409
    );
  }

  // Fetch positions under this unit
  const positions = await prisma.tbl_position.findMany({
    where: { unit_id },
    select: { position_id: true, position_status: true },
  });

  const positionIds = positions.map(pos => pos.position_id);
  const activePositionCount = positions.filter(
    (pos) => pos.position_status === 'ACTIVE'
  ).length;

  const assignmentCount = positionIds.length
    ? await prisma.tbl_user_position_assignments.count({
        where: { position_id: { in: positionIds } },
      })
    : 0;

  await prisma.$transaction(async (tx) => {
    await tx.tbl_unit.update({
      where: { unit_id },
      data: { status: 'INACTIVE' },
    });

    await tx.tbl_position.updateMany({
      where: { unit_id },
      data: { position_status: 'INACTIVE' },
    });

    if (positionIds.length > 0) {
      // Deactivating a position must also release the people holding it,
      // otherwise users keep an assignment to a position that no longer exists
      // and the unit still reports them as members.
      await tx.tbl_user_position_assignments.deleteMany({
        where: { position_id: { in: positionIds } },
      });

      // Inuma users cached this unit at sign-in. Clearing the pointers makes
      // the next sign-in re-map them to a surviving unit instead of stranding
      // them on a deleted one.
      await tx.tbl_auth.updateMany({
        where: { matched_unit_id: unit_id },
        data: { matched_unit_id: null },
      });
      await tx.tbl_auth.updateMany({
        where: { matched_position_id: { in: positionIds } },
        data: { matched_position_id: null },
      });
    }
  }, WRITE_TX_OPTIONS);

  return {
    message: 'Unit archived successfully',
    unit_id,
    positions_archived: activePositionCount,
    users_unassigned: assignmentCount,
  };
};

export const getSinglePositionService = async ({ position_id, user }: GetSinglePositionParams) => {
  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: {
        select: {
          organization_id: true
        }
      },
      ...positionAssignmentsInclude,
    }
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }

  const positionOrgId = position.unit.organization_id;

  // If user has no global org access, restrict to same org
  if (user.organization_id !== positionOrgId && !user.position_access?.organizations.create) {
    throw new AppError('You do not have permission to view this position', 403);
  }

  return enrichPositionResponse(position);
};

export const updatePositionService = async ({
  position_id,
  updateData,
  user
}: UpdatePositionParams) => {
  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: true
    }
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }

  if (position.unit.organization_id !== user.organization_id && !user.position_access?.organizations.create) {
    throw new AppError('You can only update positions within your organization', 403);
  }

  // Prevent silent deactivation of the protected SuperAdmin position via the
  // update endpoint (which would otherwise be a backdoor around the delete
  // guard).
  if (
    isProtectedSuperAdminPosition(position.position_name) &&
    (updateData as { position_status?: string }).position_status === 'INACTIVE'
  ) {
    throw new AppError('The SuperAdmin position cannot be deactivated', 403);
  }

  if (updateData.position_access) {
    updateData.position_access = clampPositionAccess(
      user.position_access as position_accesses,
      updateData.position_access as position_accesses
    ) as unknown as Prisma.InputJsonValue;
  }

  const updatedPosition = await prisma.tbl_position.update({
    where: { position_id },
    data: updateData
  });

  return updatedPosition;
};

export async function getPositionsService(organization_id?: string) {
  const positions = await prisma.tbl_position.findMany({
    where: {
      position_status: 'ACTIVE',
      ...(organization_id
        ? {
            unit: {
              organization_id: organization_id,
            },
          }
        : {}),
    },
    include: {
      unit: {
        include: {
          organization: true,
        },
      },
      ...positionAssignmentsInclude,
    },
  });

  return positions.map(enrichPositionResponse);
}

export const assignUserToPositionService = async ({
  position_id,
  user_email,
  user,
}: AssignUserToPositionParams) => {
  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: true,
      ...positionAssignmentsInclude,
    },
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }

  if (!user.position_access?.organizations?.create && position.unit.organization_id !== user.organization_id) {
    throw new AppError('You can only assign users to positions within your organization', 403);
  }

  const auth = await prisma.tbl_auth.findUnique({
    where: { email: user_email },
    include: { user: true },
  });

  if (!auth || !auth.user || auth.user_status !== 'ACTIVE') {
    throw new AppError('User with this email not found', 404);
  }

  const alreadyAssigned = await userHasPositionAssignment(
    prisma,
    auth.user.user_id,
    position_id
  );
  if (alreadyAssigned) {
    throw new AppError('User is already assigned to this position', 409);
  }

  await createUserPositionAssignment(prisma, auth.user.user_id, position_id);

  const updatedPosition = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: positionAssignmentsInclude,
  });

  if (!updatedPosition) {
    throw new AppError('Position not found', 404);
  }

  return enrichPositionResponse(updatedPosition);
};

