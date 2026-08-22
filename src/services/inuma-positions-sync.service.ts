import { Prisma, PrismaClient } from '@prisma/client';
import {
  INUMA_APPROVER_IMOTRAK_POSITION,
  INUMA_APPROVER_UNIT_NAMES,
  normalizeCampusName,
  normalizeCatalogName,
} from '../constants/inuma';
import { AppError } from '../utils/Error';
import { resolveInumaSyncTarget } from '../utils/inumaOrganization';
import { isProtectedSuperAdminPosition } from './organization.services';
import { buildStandardInumaUserAccess } from '../utils/inumaAccessTemplates';
import { canManageInumaAccess } from './inuma-access.service';
import { getInumaCatalog } from './inuma-catalog.service';

const prisma = new PrismaClient();

const PROTECTED_POSITION_NAMES = new Set(
  [INUMA_APPROVER_IMOTRAK_POSITION, 'SuperAdmin'].map(normalizeCatalogName)
);

async function assertCanSyncPositions(approverUserId: string) {
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: approverUserId },
    include: {
      auth: true,
      position_assignments: {
        include: { position: true },
      },
    },
  });

  if (!user?.auth) {
    throw new AppError('User not found', 404);
  }

  const activeAssignment = user.position_assignments.find(
    (assignment) => assignment.position.position_status === 'ACTIVE'
  );
  const positionAccess = activeAssignment?.position.position_access as
    | import('../types/access').position_accesses
    | undefined;

  if (
    !canManageInumaAccess({
      inumaPosition: user.auth.inuma_position,
      positionAccess,
    })
  ) {
    throw new AppError(
      'Only authorized Assets and Services Management administrators can sync Inuma positions',
      403
    );
  }

  return user;
}

async function findCatalogUnit(organizationId: string) {
  const units = await prisma.tbl_unit.findMany({
    where: { organization_id: organizationId, status: 'ACTIVE' },
  });

  for (const preferred of INUMA_APPROVER_UNIT_NAMES) {
    const match = units.find(
      (unit) => normalizeCatalogName(unit.unit_name) === normalizeCatalogName(preferred)
    );
    if (match) return match;
  }

  const fleetUnit = units.find((unit) =>
    normalizeCatalogName(unit.unit_name).includes('fleet')
  );
  if (fleetUnit) return fleetUnit;

  if (units.length === 0) {
    throw new AppError('No active units found for Inuma position catalog sync', 404);
  }

  return units[0];
}

export type SyncInumaPositionsResult = {
  organization_id: string;
  unit_id: string;
  unit_name: string;
  deactivated_count: number;
  created_count: number;
  reactivated_count: number;
  skipped_protected_count: number;
  inuma_positions_total: number;
};

export async function syncInumaPositionsCatalog(params: {
  approverUserId: string;
  organizationId?: string;
}): Promise<SyncInumaPositionsResult> {
  await assertCanSyncPositions(params.approverUserId);

  // Explicit admin action, so a mis-targeted sync is reported rather than
  // silently skipped the way the opportunistic ensure* helpers do.
  const organizationId = await resolveInumaSyncTarget(params.organizationId);
  if (!organizationId) {
    throw new AppError(
      'The Inuma catalog can only be synced into the University of Rwanda organization. Check INUMA_ORGANIZATION_ID / INUMA_ORGANIZATION_NAME.',
      400
    );
  }

  const catalogUnit = await findCatalogUnit(organizationId);
  const catalog = await getInumaCatalog(true);

  const inumaPositions = catalog.positions.filter(
    (position) => position.is_active !== false && position.name?.trim()
  );

  if (inumaPositions.length === 0) {
    throw new AppError('Inuma returned no active positions to sync', 502);
  }

  const existingPositions = await prisma.tbl_position.findMany({
    where: {
      unit: { organization_id: organizationId },
      position_status: 'ACTIVE',
    },
    select: {
      position_id: true,
      position_name: true,
      unit_id: true,
    },
  });

  let deactivatedCount = 0;
  let skippedProtectedCount = 0;
  let createdCount = 0;
  let reactivatedCount = 0;

  const defaultAccess = buildStandardInumaUserAccess();
  const toDeactivate = existingPositions.filter((position) => {
    const normalized = normalizeCatalogName(position.position_name);
    if (
      PROTECTED_POSITION_NAMES.has(normalized) ||
      isProtectedSuperAdminPosition(position.position_name)
    ) {
      skippedProtectedCount += 1;
      return false;
    }
    return true;
  });
  const deactivateIds = toDeactivate.map((position) => position.position_id);

  if (deactivateIds.length > 0) {
    await prisma.tbl_user_position_assignments.deleteMany({
      where: { position_id: { in: deactivateIds } },
    });
    await prisma.tbl_position.updateMany({
      where: { position_id: { in: deactivateIds } },
      data: { position_status: 'INACTIVE' },
    });
    deactivatedCount = deactivateIds.length;
  }

  const existingInCatalogUnit = await prisma.tbl_position.findMany({
    where: { unit_id: catalogUnit.unit_id },
    select: { position_id: true, position_name: true, position_status: true },
  });
  const existingByName = new Map(
    existingInCatalogUnit.map((position) => [
      normalizeCatalogName(position.position_name),
      position,
    ])
  );

  const toCreate: Prisma.tbl_positionCreateManyInput[] = [];
  const toReactivate: string[] = [];

  for (const inumaPosition of inumaPositions) {
    const existing = existingByName.get(normalizeCatalogName(inumaPosition.name));
    if (existing) {
      if (existing.position_status !== 'ACTIVE') {
        toReactivate.push(existing.position_id);
      }
      continue;
    }

    toCreate.push({
      position_name: inumaPosition.name,
      position_description:
        inumaPosition.description ||
        `Synced from Inuma position catalog (${inumaPosition._id})`,
      position_access: defaultAccess as unknown as Prisma.InputJsonValue,
      unit_id: catalogUnit.unit_id,
      position_status: 'ACTIVE',
    });
  }

  if (toReactivate.length > 0) {
    await prisma.tbl_position.updateMany({
      where: { position_id: { in: toReactivate } },
      data: { position_status: 'ACTIVE' },
    });
    reactivatedCount = toReactivate.length;
  }

  if (toCreate.length > 0) {
    const created = await prisma.tbl_position.createMany({
      data: toCreate,
      skipDuplicates: true,
    });
    createdCount = created.count;
  }

  return {
    organization_id: organizationId,
    unit_id: catalogUnit.unit_id,
    unit_name: catalogUnit.unit_name,
    deactivated_count: deactivatedCount,
    created_count: createdCount,
    reactivated_count: reactivatedCount,
    skipped_protected_count: skippedProtectedCount,
    inuma_positions_total: inumaPositions.length,
  };
}

export async function getInumaPositionsPreview() {
  const catalog = await getInumaCatalog(true);
  return catalog.positions.filter((position) => position.is_active !== false);
}

/** Ensure Inuma catalog positions exist in ImoTrak so they appear on the Positions page. */
export async function ensureInumaPositionsListed(organizationId?: string): Promise<void> {
  if (!process.env.INUMA_API_KEY?.trim()) return;

  // Same tenant guard as the campus sync — Inuma positions are UR's positions.
  const orgId = await resolveInumaSyncTarget(organizationId);
  if (!orgId) return;

  const catalogUnit = await findCatalogUnit(orgId);
  const catalog = await getInumaCatalog();
  const inumaPositions = catalog.positions.filter(
    (position) => position.is_active !== false && position.name?.trim()
  );
  if (inumaPositions.length === 0) return;

  const existing = await prisma.tbl_position.findMany({
    where: { unit_id: catalogUnit.unit_id },
    select: { position_name: true, position_id: true, position_status: true },
  });
  const existingByName = new Map(
    existing.map((position) => [normalizeCatalogName(position.position_name), position])
  );

  const defaultAccess = buildStandardInumaUserAccess();
  const toCreate: Prisma.tbl_positionCreateManyInput[] = [];
  const toReactivate: string[] = [];

  for (const inumaPosition of inumaPositions) {
    const match = existingByName.get(normalizeCatalogName(inumaPosition.name));
    if (!match) {
      toCreate.push({
        position_name: inumaPosition.name,
        position_description:
          inumaPosition.description ||
          `Synced from Inuma position catalog (${inumaPosition._id})`,
        position_access: defaultAccess as unknown as Prisma.InputJsonValue,
        unit_id: catalogUnit.unit_id,
        position_status: 'ACTIVE',
      });
      continue;
    }
    if (match.position_status !== 'ACTIVE') {
      toReactivate.push(match.position_id);
    }
  }

  if (toReactivate.length > 0) {
    await prisma.tbl_position.updateMany({
      where: { position_id: { in: toReactivate } },
      data: { position_status: 'ACTIVE' },
    });
  }

  if (toCreate.length > 0) {
    await prisma.tbl_position.createMany({
      data: toCreate,
      skipDuplicates: true,
    });
  }
}

/** Ensure Inuma campuses exist as ImoTrak units so they appear on the Units page. */
export async function ensureInumaCampusesListed(organizationId?: string): Promise<void> {
  if (!process.env.INUMA_API_KEY?.trim()) return;

  // Tenant guard: the UR campus catalog belongs to the Inuma organization and
  // nowhere else. Asking to sync into any other tenant is a no-op rather than
  // an error, because this runs opportunistically while serving GET requests.
  const orgId = await resolveInumaSyncTarget(organizationId);
  if (!orgId) return;

  const catalog = await getInumaCatalog();
  const campuses = catalog.campuses.filter(
    (campus) => campus.is_active !== false && campus.name?.trim()
  );
  if (campuses.length === 0) return;

  const existing = await prisma.tbl_unit.findMany({
    where: { organization_id: orgId },
    select: { unit_id: true, unit_name: true, status: true },
  });
  const existingByName = new Map(
    existing.map((unit) => [normalizeCampusName(unit.unit_name), unit])
  );

  const toCreate: Prisma.tbl_unitCreateManyInput[] = [];
  const queuedNames = new Set<string>();

  for (const campus of campuses) {
    const campusKey = normalizeCampusName(campus.name);
    const match = existingByName.get(campusKey);
    if (match) continue;

    // The catalog itself can list the same campus under two spellings.
    if (queuedNames.has(campusKey)) continue;
    queuedNames.add(campusKey);

    toCreate.push({
      unit_name: campus.name,
      organization_id: orgId,
      status: 'ACTIVE',
    });
  }

  if (toCreate.length > 0) {
    await prisma.tbl_unit.createMany({
      data: toCreate,
      skipDuplicates: true,
    });
  }
}
