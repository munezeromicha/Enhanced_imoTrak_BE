import { Prisma, PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';
import {
  deleteOrganizationPermanentlyService,
  isProtectedSuperAdminPosition,
} from './organization.services';
import { INUMA_APPROVER_IMOTRAK_POSITION, normalizeCatalogName } from '../constants/inuma';

const prisma = new PrismaClient();
const WRITE_TX_OPTIONS = { timeout: 30_000, maxWait: 15_000 } as const;

function rethrowWriteConflict(error: unknown, conflictMessage: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2003' || error.code === 'P2014') {
      throw new AppError(conflictMessage, 409);
    }
    if (error.code === 'P2002') {
      throw new AppError(
        'Cannot restore because another active record already uses this name in the same place',
        409
      );
    }
  }
  throw error;
}

export async function listArchivedItemsService() {
  const [organizations, units, positions] = await Promise.all([
    prisma.tbl_organizations.findMany({
      where: { organization_status: 'INACTIVE' },
      orderBy: { created_at: 'desc' },
      select: {
        organization_id: true,
        organization_name: true,
        organization_email: true,
        organization_status: true,
        created_at: true,
      },
    }),
    prisma.tbl_unit.findMany({
      where: { status: 'INACTIVE' },
      orderBy: { created_at: 'desc' },
      select: {
        unit_id: true,
        unit_name: true,
        status: true,
        created_at: true,
        organization_id: true,
        organization: {
          select: {
            organization_name: true,
            organization_status: true,
          },
        },
      },
    }),
    prisma.tbl_position.findMany({
      where: { position_status: 'INACTIVE' },
      orderBy: { created_at: 'desc' },
      select: {
        position_id: true,
        position_name: true,
        position_status: true,
        created_at: true,
        is_org_leader: true,
        unit_id: true,
        unit: {
          select: {
            unit_name: true,
            status: true,
            organization_id: true,
            organization: {
              select: {
                organization_name: true,
                organization_status: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    organizations,
    units: units.map((unit) => ({
      unit_id: unit.unit_id,
      unit_name: unit.unit_name,
      status: unit.status,
      created_at: unit.created_at,
      organization_id: unit.organization_id,
      organization_name: unit.organization.organization_name,
      organization_status: unit.organization.organization_status,
    })),
    positions: positions.map((position) => ({
      position_id: position.position_id,
      position_name: position.position_name,
      position_status: position.position_status,
      created_at: position.created_at,
      is_org_leader: position.is_org_leader,
      unit_id: position.unit_id,
      unit_name: position.unit.unit_name,
      unit_status: position.unit.status,
      organization_id: position.unit.organization_id,
      organization_name: position.unit.organization.organization_name,
      organization_status: position.unit.organization.organization_status,
    })),
  };
}

export async function restoreOrganizationService(organization_id: string) {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id },
    select: { organization_id: true, organization_status: true, organization_name: true },
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  if (organization.organization_status !== 'INACTIVE') {
    throw new AppError('Organization is not archived', 400);
  }

  const units = await prisma.tbl_unit.findMany({
    where: { organization_id },
    select: { unit_id: true },
  });
  const unitIds = units.map((unit) => unit.unit_id);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.tbl_organizations.update({
        where: { organization_id },
        data: { organization_status: 'ACTIVE' },
      });
      await tx.tbl_unit.updateMany({
        where: { organization_id },
        data: { status: 'ACTIVE' },
      });
      if (unitIds.length > 0) {
        await tx.tbl_position.updateMany({
          where: { unit_id: { in: unitIds } },
          data: { position_status: 'ACTIVE' },
        });
      }
    }, WRITE_TX_OPTIONS);
  } catch (error) {
    rethrowWriteConflict(error, 'Cannot restore this organization while related records conflict');
  }

  return {
    organization_id,
    organization_name: organization.organization_name,
    units_restored: unitIds.length,
  };
}

export async function restoreUnitService(unit_id: string) {
  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
    include: { organization: { select: { organization_status: true, organization_name: true } } },
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }
  if (unit.status !== 'INACTIVE') {
    throw new AppError('Unit is not archived', 400);
  }
  if (unit.organization.organization_status !== 'ACTIVE') {
    throw new AppError(
      `Restore ${unit.organization.organization_name} first, then restore this unit`,
      409
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.tbl_unit.update({
        where: { unit_id },
        data: { status: 'ACTIVE' },
      });
      await tx.tbl_position.updateMany({
        where: { unit_id },
        data: { position_status: 'ACTIVE' },
      });
    }, WRITE_TX_OPTIONS);
  } catch (error) {
    rethrowWriteConflict(error, 'Cannot restore this unit while related records conflict');
  }

  return { unit_id, unit_name: unit.unit_name };
}

export async function restorePositionService(position_id: string) {
  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: {
        select: {
          status: true,
          unit_name: true,
          organization: { select: { organization_status: true, organization_name: true } },
        },
      },
    },
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }
  if (position.position_status !== 'INACTIVE') {
    throw new AppError('Position is not archived', 400);
  }
  if (position.unit.organization.organization_status !== 'ACTIVE') {
    throw new AppError(
      `Restore ${position.unit.organization.organization_name} first, then restore this position`,
      409
    );
  }
  if (position.unit.status !== 'ACTIVE') {
    throw new AppError(`Restore unit ${position.unit.unit_name} first, then restore this position`, 409);
  }

  try {
    await prisma.tbl_position.update({
      where: { position_id },
      data: { position_status: 'ACTIVE' },
    });
  } catch (error) {
    rethrowWriteConflict(error, 'Cannot restore this position while related records conflict');
  }

  return { position_id, position_name: position.position_name };
}

export async function permanentlyDeleteArchivedOrganizationService({
  organization_id,
  actorUserId,
}: {
  organization_id: string;
  actorUserId: string;
}) {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id },
    select: { organization_status: true },
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  if (organization.organization_status !== 'INACTIVE') {
    throw new AppError('Archive the organization before deleting it permanently', 400);
  }

  return deleteOrganizationPermanentlyService({ organization_id, actorUserId });
}

export async function permanentlyDeleteArchivedUnitService(unit_id: string) {
  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
    include: { organization: true },
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }
  if (unit.status !== 'INACTIVE') {
    throw new AppError('Archive the unit before deleting it permanently', 400);
  }

  if (
    unit.organization.leader_unit_id === unit_id &&
    unit.organization.organization_status === 'ACTIVE'
  ) {
    throw new AppError(
      'This unit holds the organization leader. Archive the organization first, or move the leader.',
      409
    );
  }

  const vehicleCount = await prisma.tbl_vehicles.count({ where: { unit_id } });
  if (vehicleCount > 0) {
    throw new AppError(
      `Cannot permanently delete this unit while ${vehicleCount} vehicle${vehicleCount === 1 ? '' : 's'} still belong to it. Reassign or delete those vehicles first.`,
      409
    );
  }

  const positions = await prisma.tbl_position.findMany({
    where: { unit_id },
    select: { position_id: true, position_name: true },
  });
  const protectedPosition = positions.find(
    (position) =>
      isProtectedSuperAdminPosition(position.position_name) ||
      normalizeCatalogName(position.position_name) ===
        normalizeCatalogName(INUMA_APPROVER_IMOTRAK_POSITION)
  );
  if (protectedPosition) {
    throw new AppError(
      `Cannot permanently delete a unit that contains the ${protectedPosition.position_name} position`,
      403
    );
  }

  const positionIds = positions.map((position) => position.position_id);

  try {
    await prisma.$transaction(async (tx) => {
      if (unit.organization.leader_unit_id === unit_id) {
        await tx.tbl_organizations.update({
          where: { organization_id: unit.organization_id },
          data: {
            leader_unit_id: null,
            leader_position_id:
              unit.organization.leader_position_id &&
              positionIds.includes(unit.organization.leader_position_id)
                ? null
                : unit.organization.leader_position_id,
          },
        });
      }

      await tx.tbl_reservations.updateMany({
        where: { unit_id },
        data: { unit_id: null },
      });
      await tx.tbl_fuel_requisitions.updateMany({
        where: { unit_id },
        data: { unit_id: null },
      });
      await tx.tbl_generators.updateMany({
        where: { unit_id },
        data: { unit_id: null },
      });

      if (positionIds.length > 0) {
        await tx.tbl_user_position_assignments.deleteMany({
          where: { position_id: { in: positionIds } },
        });
        await tx.tbl_auth.updateMany({
          where: { matched_position_id: { in: positionIds } },
          data: { matched_position_id: null },
        });
      }

      await tx.tbl_auth.updateMany({
        where: { matched_unit_id: unit_id },
        data: { matched_unit_id: null },
      });

      await tx.tbl_position.deleteMany({ where: { unit_id } });
      await tx.tbl_unit.delete({ where: { unit_id } });
    }, WRITE_TX_OPTIONS);
  } catch (error) {
    rethrowWriteConflict(
      error,
      'Cannot permanently delete this unit while other records still reference it'
    );
  }

  return { unit_id, unit_name: unit.unit_name };
}

export async function permanentlyDeleteArchivedPositionService(position_id: string) {
  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: {
        include: { organization: true },
      },
    },
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }
  if (position.position_status !== 'INACTIVE') {
    throw new AppError('Archive the position before deleting it permanently', 400);
  }
  if (isProtectedSuperAdminPosition(position.position_name)) {
    throw new AppError('The SuperAdmin position cannot be deleted', 403);
  }
  if (
    normalizeCatalogName(position.position_name) ===
    normalizeCatalogName(INUMA_APPROVER_IMOTRAK_POSITION)
  ) {
    throw new AppError('The Assets & Services Administrator position cannot be deleted', 403);
  }

  const org = position.unit.organization;
  if (position.is_org_leader && org.organization_status === 'ACTIVE') {
    throw new AppError(
      'This is the organization leader position. Archive the organization first, or move the leader.',
      409
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (org.leader_position_id === position_id) {
        await tx.tbl_organizations.update({
          where: { organization_id: org.organization_id },
          data: { leader_position_id: null },
        });
      }

      await tx.tbl_user_position_assignments.deleteMany({
        where: { position_id },
      });
      await tx.tbl_auth.updateMany({
        where: { matched_position_id: position_id },
        data: { matched_position_id: null },
      });
      await tx.tbl_position.delete({ where: { position_id } });
    }, WRITE_TX_OPTIONS);
  } catch (error) {
    rethrowWriteConflict(
      error,
      'Cannot permanently delete this position while other records still reference it'
    );
  }

  return { position_id, position_name: position.position_name };
}
