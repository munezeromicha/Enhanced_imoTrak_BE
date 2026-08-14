import { Prisma, PrismaClient } from '@prisma/client';
import {
  INUMA_APPROVER_IMOTRAK_POSITION,
  INUMA_APPROVER_UNIT_NAMES,
  normalizeCatalogName,
} from '../constants/inuma';
import { AppError } from '../utils/Error';
import { isProtectedSuperAdminPosition } from './organization.services';
import { buildLimitedInumaSignInAccess } from '../utils/inumaAccessTemplates';
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

async function resolveOrganizationId(organizationId?: string): Promise<string> {
  if (organizationId) {
    const org = await prisma.tbl_organizations.findUnique({
      where: { organization_id: organizationId },
    });
    if (org) return org.organization_id;
  }

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
      organization_name: { equals: configuredName, mode: 'insensitive' },
      organization_status: 'ACTIVE',
    },
  });
  if (byName) return byName.organization_id;

  throw new AppError('Target organization for Inuma sync was not found', 404);
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

  const organizationId = await resolveOrganizationId(params.organizationId);
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

  const defaultAccess = buildLimitedInumaSignInAccess();

  await prisma.$transaction(async (tx) => {
    for (const position of existingPositions) {
      const normalized = normalizeCatalogName(position.position_name);
      if (
        PROTECTED_POSITION_NAMES.has(normalized) ||
        isProtectedSuperAdminPosition(position.position_name)
      ) {
        skippedProtectedCount += 1;
        continue;
      }

      await tx.tbl_user_position_assignments.deleteMany({
        where: { position_id: position.position_id },
      });

      await tx.tbl_position.update({
        where: { position_id: position.position_id },
        data: { position_status: 'INACTIVE' },
      });

      deactivatedCount += 1;
    }

    for (const inumaPosition of inumaPositions) {
      const existing = await tx.tbl_position.findUnique({
        where: {
          position_name_unit_id: {
            position_name: inumaPosition.name,
            unit_id: catalogUnit.unit_id,
          },
        },
      });

      if (existing) {
        await tx.tbl_position.update({
          where: { position_id: existing.position_id },
          data: {
            position_description:
              inumaPosition.description ||
              `Synced from Inuma position catalog (${inumaPosition._id})`,
            position_status: 'ACTIVE',
          },
        });
        reactivatedCount += 1;
        continue;
      }

      await tx.tbl_position.create({
        data: {
          position_name: inumaPosition.name,
          position_description:
            inumaPosition.description ||
            `Synced from Inuma position catalog (${inumaPosition._id})`,
          position_access: defaultAccess as unknown as Prisma.InputJsonValue,
          unit_id: catalogUnit.unit_id,
          position_status: 'ACTIVE',
        },
      });
      createdCount += 1;
    }
  });

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
