import { Prisma, PrismaClient } from '@prisma/client';
import {
  INUMA_APPROVER_IMOTRAK_POSITION,
  INUMA_APPROVER_UNIT_NAMES,
  isAuthorizedInumaApproverPosition,
  normalizeCatalogName,
} from '../constants/inuma';
import { AppError } from '../utils/Error';
import { SsoIdentity } from '../utils/sso-jwks';
import {
  buildAssetsServicesApproverAccess,
  buildDefaultInumaSyncedPositionAccess,
} from '../utils/inumaAccessTemplates';
import { userPositionAssignmentsInclude, UserWithPositionAssignments } from '../utils/userPositions';
import {
  findInumaCampus,
  findInumaPosition,
  getInumaCatalog,
} from './inuma-catalog.service';

const prisma = new PrismaClient();

export type AuthWithUser = {
  auth_id: string;
  user_status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
  imotrak_access_approved_at: Date | null;
  imotrak_access_approved_by_user_id: string | null;
  inuma_position: string | null;
  inuma_unit: string | null;
  user: UserWithPositionAssignments;
};

export type InumaSyncResult = {
  isApprover: boolean;
  isPendingApproval: boolean;
  matchedUnitId?: string;
  matchedPositionId?: string;
  inumaPosition?: string;
  inumaUnit?: string;
};

async function resolveInumaOrganizationId(): Promise<string> {
  const configured = (process.env.INUMA_ORGANIZATION_ID || '').trim();
  if (configured) {
    const org = await prisma.tbl_organizations.findUnique({
      where: { organization_id: configured },
    });
    if (org) return org.organization_id;
  }

  const configuredName = (process.env.INUMA_ORGANIZATION_NAME || 'University of Rwanda').trim();
  const byName = await prisma.tbl_organizations.findFirst({
    where: {
      organization_name: {
        equals: configuredName,
        mode: 'insensitive',
      },
      organization_status: 'ACTIVE',
    },
  });
  if (byName) return byName.organization_id;

  const anyActive = await prisma.tbl_organizations.findFirst({
    where: { organization_status: 'ACTIVE' },
    orderBy: { created_at: 'asc' },
  });
  if (!anyActive) {
    throw new AppError('No active organization found for Inuma mapping', 500);
  }
  return anyActive.organization_id;
}

async function findUnitByCampusName(organizationId: string, campusName: string) {
  const normalized = normalizeCatalogName(campusName);
  const units = await prisma.tbl_unit.findMany({
    where: {
      organization_id: organizationId,
      status: 'ACTIVE',
    },
  });

  return (
    units.find((unit) => normalizeCatalogName(unit.unit_name) === normalized) ||
    units.find((unit) =>
      normalizeCatalogName(unit.unit_name).includes(normalized)
    ) ||
    units.find((unit) =>
      normalized.includes(normalizeCatalogName(unit.unit_name))
    )
  );
}

async function findApproverUnit(organizationId: string) {
  const units = await prisma.tbl_unit.findMany({
    where: {
      organization_id: organizationId,
      status: 'ACTIVE',
    },
  });

  for (const preferred of INUMA_APPROVER_UNIT_NAMES) {
    const match = units.find(
      (unit) => normalizeCatalogName(unit.unit_name) === normalizeCatalogName(preferred)
    );
    if (match) return match;
  }

  return units.find((unit) => normalizeCatalogName(unit.unit_name).includes('fleet'));
}

async function ensureApproverPosition(unitId: string) {
  const access = buildAssetsServicesApproverAccess();
  return prisma.tbl_position.upsert({
    where: {
      position_name_unit_id: {
        position_name: INUMA_APPROVER_IMOTRAK_POSITION,
        unit_id: unitId,
      },
    },
    update: {
      position_access: access as unknown as Prisma.InputJsonValue,
      position_status: 'ACTIVE',
    },
    create: {
      position_name: INUMA_APPROVER_IMOTRAK_POSITION,
      position_description:
        'Assets and Services Management approver with full ImoTrak access except organization management.',
      position_access: access as unknown as Prisma.InputJsonValue,
      unit_id: unitId,
      position_status: 'ACTIVE',
    },
  });
}

async function ensureSyncedInumaPosition(unitId: string, positionName: string) {
  const access = buildDefaultInumaSyncedPositionAccess();
  return prisma.tbl_position.upsert({
    where: {
      position_name_unit_id: {
        position_name: positionName,
        unit_id: unitId,
      },
    },
    update: {
      position_status: 'ACTIVE',
    },
    create: {
      position_name: positionName,
      position_description: `Synced from Inuma position catalog: ${positionName}`,
      position_access: access as unknown as Prisma.InputJsonValue,
      unit_id: unitId,
      position_status: 'ACTIVE',
    },
  });
}

async function ensureUserAssignment(userId: string, positionId: string) {
  return prisma.tbl_user_position_assignments.upsert({
    where: {
      user_id_position_id: {
        user_id: userId,
        position_id: positionId,
      },
    },
    update: {},
    create: {
      user_id: userId,
      position_id: positionId,
    },
  });
}

function userHasActiveAssignments(auth: AuthWithUser): boolean {
  return (auth.user?.position_assignments?.length ?? 0) > 0;
}

function isApprovedAuth(auth: AuthWithUser): boolean {
  if (auth.user_status === 'INACTIVE' || auth.user_status === 'SUSPENDED') {
    return false;
  }

  if (auth.imotrak_access_approved_at) {
    return auth.user_status === 'ACTIVE';
  }

  // Users provisioned before the Inuma approval workflow already have assignments.
  return auth.user_status === 'ACTIVE' && userHasActiveAssignments(auth);
}

export async function syncInumaAccessForUser(
  identity: SsoIdentity,
  auth: AuthWithUser
): Promise<InumaSyncResult> {
  const catalog = await getInumaCatalog();
  const organizationId = await resolveInumaOrganizationId();

  const inumaPosition = identity.position?.trim() || auth.inuma_position || undefined;
  const inumaUnit = identity.unit?.trim() || auth.inuma_unit || undefined;

  const campusRecord = findInumaCampus(catalog, inumaUnit);
  const positionRecord = findInumaPosition(catalog, inumaPosition);
  const isApprover = isAuthorizedInumaApproverPosition(inumaPosition);

  let matchedUnitId: string | undefined;
  let matchedPositionId: string | undefined;

  if (isApprover) {
    const approverUnit = await findApproverUnit(organizationId);
    if (!approverUnit) {
      throw new AppError(
        'Could not find UR-Fleet unit for Assets and Services approver mapping',
        500
      );
    }

    const approverPosition = await ensureApproverPosition(approverUnit.unit_id);
    matchedUnitId = approverUnit.unit_id;
    matchedPositionId = approverPosition.position_id;

    await ensureUserAssignment(auth.user!.user_id, approverPosition.position_id);

    await prisma.tbl_auth.update({
      where: { auth_id: auth.auth_id },
      data: {
        inuma_position: inumaPosition,
        inuma_unit: inumaUnit,
        inuma_campus_code: campusRecord?.code,
        matched_unit_id: matchedUnitId,
        matched_position_id: matchedPositionId,
        user_status: 'ACTIVE',
        imotrak_access_approved_at: auth.imotrak_access_approved_at || new Date(),
        imotrak_access_approved_by_user_id: auth.imotrak_access_approved_by_user_id,
      },
    });

    return {
      isApprover: true,
      isPendingApproval: false,
      matchedUnitId,
      matchedPositionId,
      inumaPosition,
      inumaUnit,
    };
  }

  if (!inumaUnit || !inumaPosition) {
    await prisma.tbl_auth.update({
      where: { auth_id: auth.auth_id },
      data: {
        inuma_position: inumaPosition,
        inuma_unit: inumaUnit,
        inuma_campus_code: campusRecord?.code,
        user_status: isApprovedAuth(auth) ? auth.user_status : 'PENDING_APPROVAL',
      },
    });

    return {
      isApprover: false,
      isPendingApproval: !isApprovedAuth(auth),
      inumaPosition,
      inumaUnit,
    };
  }

  const matchedUnit = await findUnitByCampusName(organizationId, inumaUnit);
  if (!matchedUnit) {
    await prisma.tbl_auth.update({
      where: { auth_id: auth.auth_id },
      data: {
        inuma_position: inumaPosition,
        inuma_unit: inumaUnit,
        inuma_campus_code: campusRecord?.code,
        user_status: isApprovedAuth(auth) ? auth.user_status : 'PENDING_APPROVAL',
      },
    });

    return {
      isApprover: false,
      isPendingApproval: !isApprovedAuth(auth),
      inumaPosition,
      inumaUnit,
    };
  }

  const positionName = positionRecord?.name || inumaPosition;
  const syncedPosition = await ensureSyncedInumaPosition(
    matchedUnit.unit_id,
    positionName
  );

  matchedUnitId = matchedUnit.unit_id;
  matchedPositionId = syncedPosition.position_id;

  const alreadyApproved = isApprovedAuth(auth);
  const hasAssignments = userHasActiveAssignments(auth);

  if (alreadyApproved && !hasAssignments) {
    await ensureUserAssignment(auth.user!.user_id, syncedPosition.position_id);
  }

  if (alreadyApproved) {
    await prisma.tbl_auth.update({
      where: { auth_id: auth.auth_id },
      data: {
        inuma_position: inumaPosition,
        inuma_unit: inumaUnit,
        inuma_campus_code: campusRecord?.code,
        matched_unit_id: matchedUnitId,
        matched_position_id: matchedPositionId,
        user_status: 'ACTIVE',
      },
    });

    return {
      isApprover: false,
      isPendingApproval: false,
      matchedUnitId,
      matchedPositionId,
      inumaPosition,
      inumaUnit,
    };
  }

  await prisma.tbl_auth.update({
    where: { auth_id: auth.auth_id },
    data: {
      inuma_position: inumaPosition,
      inuma_unit: inumaUnit,
      inuma_campus_code: campusRecord?.code,
      matched_unit_id: matchedUnitId,
      matched_position_id: matchedPositionId,
      user_status: 'PENDING_APPROVAL',
    },
  });

  return {
    isApprover: false,
    isPendingApproval: true,
    matchedUnitId,
    matchedPositionId,
    inumaPosition,
    inumaUnit,
  };
}

export async function reloadAuthWithAssignments(authId: string) {
  return prisma.tbl_auth.findUniqueOrThrow({
    where: { auth_id: authId },
    include: {
      user: {
        include: userPositionAssignmentsInclude,
      },
    },
  });
}

export function canManageInumaAccess(params: {
  inumaPosition?: string | null;
  positionAccess?: import('../types/access').position_accesses;
}): boolean {
  if (isAuthorizedInumaApproverPosition(params.inumaPosition)) {
    return true;
  }

  const access = params.positionAccess;
  if (!access) return false;

  return (
    !!access.users?.view &&
    !!access.users?.update &&
    !!access.positions?.assignUser &&
    !access.organizations?.create
  );
}
