import { Prisma, PrismaClient } from '@prisma/client';
import {
  INUMA_APPROVER_IMOTRAK_POSITION,
  INUMA_APPROVER_UNIT_NAMES,
  isAuthorizedInumaApproverPosition,
  normalizeCatalogName,
} from '../constants/inuma';
import { AppError } from '../utils/Error';
import { resolveInumaOrganizationId as resolveSharedInumaOrganizationId } from '../utils/inumaOrganization';
import { SsoIdentity } from '../utils/sso-jwks';
import {
  buildAssetsServicesApproverAccess,
  buildStandardInumaUserAccess,
  isLimitedInumaSignInAccess,
} from '../utils/inumaAccessTemplates';
import { userPositionAssignmentsInclude, UserWithPositionAssignments } from '../utils/userPositions';
import {
  findInumaCampus,
  findInumaPosition,
  getInumaCatalog,
  type InumaCatalog,
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
  matchedUnitId?: string;
  matchedPositionId?: string;
  inumaPosition?: string;
  inumaUnit?: string;
};

/**
 * The organization an Inuma user is mapped into at sign-in.
 *
 * Primary resolution is shared with the catalog sync so both agree on which
 * tenant is UR. The "oldest active organization" fallback only keeps sign-in
 * working on a database where UR has not been named yet — it is not a sync
 * target, and `ensureInumaCampusesListed` will refuse to write campuses into
 * it.
 */
async function resolveInumaOrganizationId(): Promise<string> {
  const inumaOrgId = await resolveSharedInumaOrganizationId();
  if (inumaOrgId) return inumaOrgId;

  const anyActive = await prisma.tbl_organizations.findFirst({
    where: { organization_status: 'ACTIVE' },
    orderBy: { created_at: 'asc' },
  });
  if (!anyActive) {
    throw new AppError('No active organization found for Inuma mapping', 500);
  }
  console.warn(
    '[inuma] No organization matches INUMA_ORGANIZATION_ID/NAME; ' +
      'falling back to the oldest active organization for user mapping only.'
  );
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

async function findFallbackUnit(organizationId: string) {
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

  return (
    units.find((unit) => normalizeCatalogName(unit.unit_name).includes('fleet')) ||
    units[0]
  );
}

async function resolveUnitForInumaUser(
  organizationId: string,
  inumaUnit: string | undefined,
  catalog: InumaCatalog
) {
  if (inumaUnit) {
    const campusRecord = findInumaCampus(catalog, inumaUnit);
    const campusName = campusRecord?.name || inumaUnit;
    const byCampus = await findUnitByCampusName(organizationId, campusName);
    if (byCampus) return byCampus;

    const org = await prisma.tbl_organizations.findUnique({
      where: { organization_id: organizationId },
    });
    if (
      org &&
      normalizeCatalogName(inumaUnit) === normalizeCatalogName(org.organization_name)
    ) {
      return findFallbackUnit(organizationId);
    }
  }

  return findFallbackUnit(organizationId);
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
        'Assets and Services Management administrator with full ImoTrak access except organization management.',
      position_access: access as unknown as Prisma.InputJsonValue,
      unit_id: unitId,
      position_status: 'ACTIVE',
    },
  });
}

/**
 * The ImoTrak position an ordinary Inuma user lands in.
 *
 * Signing in through Inuma *is* the registration, so the position is created
 * under the person's campus unit with working staff access and they are
 * assigned to it there and then. Nothing waits on an administrator.
 *
 * A position that already exists keeps whatever access an administrator has
 * configured on it. The one exception is a position still carrying the old
 * sign-in-limited template untouched: nobody chose those permissions, they
 * were a placeholder for the approval step that no longer exists, so they are
 * upgraded in place rather than leaving that team stuck.
 */
async function ensureInumaStaffPosition(
  unitId: string,
  positionName: string,
  usesReservations: boolean
) {
  const access = buildStandardInumaUserAccess(usesReservations);
  const description = `Inuma position: ${positionName}`;

  const existing = await prisma.tbl_position.findUnique({
    where: {
      position_name_unit_id: { position_name: positionName, unit_id: unitId },
    },
    select: { position_id: true, position_access: true },
  });

  if (existing) {
    const neverConfigured = isLimitedInumaSignInAccess(existing.position_access);
    return prisma.tbl_position.update({
      where: { position_id: existing.position_id },
      data: {
        position_status: 'ACTIVE',
        ...(neverConfigured
          ? {
              position_access: access as unknown as Prisma.InputJsonValue,
              position_description: description,
            }
          : {}),
      },
    });
  }

  return prisma.tbl_position.create({
    data: {
      position_name: positionName,
      position_description: description,
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


export async function syncInumaAccessForUser(
  identity: SsoIdentity,
  auth: AuthWithUser
): Promise<InumaSyncResult> {
  const catalog = await getInumaCatalog();
  const organizationId = await resolveInumaOrganizationId();

  // Campus units must exist before the user is matched to one — otherwise
  // every campus falls back to UR-Fleet and campus scoping collapses.
  try {
    const { ensureInumaCampusesListed } = await import(
      './inuma-positions-sync.service'
    );
    await ensureInumaCampusesListed(organizationId);
  } catch (error) {
    console.warn('Inuma campuses could not be listed during sign-in:', error);
  }

  const inumaPosition = identity.position?.trim() || auth.inuma_position || undefined;
  const inumaUnit = identity.unit?.trim() || auth.inuma_unit || undefined;

  const campusRecord = findInumaCampus(catalog, inumaUnit);
  const positionRecord = findInumaPosition(catalog, inumaPosition);
  const isApprover = isAuthorizedInumaApproverPosition(inumaPosition);

  if (isApprover) {
    const approverUnit = await resolveUnitForInumaUser(
      organizationId,
      inumaUnit,
      catalog
    );
    if (!approverUnit) {
      throw new AppError(
        'Could not find UR-Fleet unit for Assets and Services administrator mapping',
        500
      );
    }

    const approverPosition = await ensureApproverPosition(approverUnit.unit_id);
    await ensureUserAssignment(auth.user!.user_id, approverPosition.position_id);

    await prisma.tbl_auth.update({
      where: { auth_id: auth.auth_id },
      data: {
        inuma_position: inumaPosition,
        inuma_unit: inumaUnit,
        inuma_campus_code: campusRecord?.code,
        matched_unit_id: approverUnit.unit_id,
        matched_position_id: approverPosition.position_id,
        user_status: 'ACTIVE',
        imotrak_access_approved_at: auth.imotrak_access_approved_at || new Date(),
      },
    });

    return {
      isApprover: true,
      matchedUnitId: approverUnit.unit_id,
      matchedPositionId: approverPosition.position_id,
      inumaPosition,
      inumaUnit,
    };
  }

  const matchedUnit = await resolveUnitForInumaUser(organizationId, inumaUnit, catalog);
  if (!matchedUnit) {
    throw new AppError('No ImoTrak unit available for Inuma user mapping', 500);
  }

  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id: organizationId },
    select: { uses_reservations: true },
  });

  const positionName = positionRecord?.name || inumaPosition || 'Inuma User';
  const staffPosition = await ensureInumaStaffPosition(
    matchedUnit.unit_id,
    positionName,
    organization?.uses_reservations ?? true
  );

  await ensureUserAssignment(auth.user!.user_id, staffPosition.position_id);

  await prisma.tbl_auth.update({
    where: { auth_id: auth.auth_id },
    data: {
      inuma_position: inumaPosition,
      inuma_unit: inumaUnit,
      inuma_campus_code: campusRecord?.code,
      matched_unit_id: matchedUnit.unit_id,
      matched_position_id: staffPosition.position_id,
      user_status: 'ACTIVE',
      // Signing in through Inuma is the registration, so the account is never
      // parked in a pending state waiting to be approved. Kept idempotent so
      // the original registration date survives later sign-ins.
      imotrak_access_approved_at: auth.imotrak_access_approved_at || new Date(),
    },
  });

  return {
    isApprover: false,
    matchedUnitId: matchedUnit.unit_id,
    matchedPositionId: staffPosition.position_id,
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
