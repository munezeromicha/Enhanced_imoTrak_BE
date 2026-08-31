import { Prisma, PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';
import {
  deleteOrganizationPermanentlyService,
  isProtectedSuperAdminPosition,
} from './organization.services';
import type { AuthContext } from '../utils/authContext';
import { isHubSuperAdmin } from '../utils/authContext';
import type { position_accesses } from '../types/access';

const prisma = new PrismaClient();
const WRITE_TX_OPTIONS = { timeout: 120_000, maxWait: 15_000 } as const;

export type ArchiveGrants = {
  view: boolean;
  restore: boolean;
  delete: boolean;
  organizations: boolean;
  units: boolean;
  positions: boolean;
  isHub: boolean;
  organizationId: string;
  unitId: string | null;
  unitRestricted: boolean;
};

export function archiveGrantsFrom(ctx: AuthContext): ArchiveGrants {
  const archive = (ctx.permissions as position_accesses).archive;
  const isHub = isHubSuperAdmin(ctx);
  return {
    view: !!(archive?.view || archive?.organizations || archive?.units || archive?.positions),
    restore: !!archive?.restore,
    delete: !!archive?.delete,
    organizations: !!archive?.organizations,
    units: !!archive?.units,
    positions: !!archive?.positions,
    isHub,
    organizationId: ctx.organizationId,
    unitId: ctx.unitId,
    unitRestricted: ctx.unitRestricted,
  };
}

function assertCan(grants: ArchiveGrants, action: 'restore' | 'delete', entity: 'organizations' | 'units' | 'positions') {
  if (!grants.view) {
    throw new AppError('You do not have permission to access the archive', 403);
  }
  if (!grants[action]) {
    throw new AppError(
      action === 'restore'
        ? 'You do not have permission to restore archived items'
        : 'You do not have permission to permanently delete archived items',
      403
    );
  }
  if (!grants[entity]) {
    throw new AppError(`You do not have permission to archive ${entity}`, 403);
  }
}

function assertTenantScope(
  grants: ArchiveGrants,
  organizationId: string,
  unitId?: string | null
) {
  if (grants.isHub) return;
  if (organizationId !== grants.organizationId) {
    throw new AppError('You can only manage archived items in your organization', 403);
  }
  if (grants.unitRestricted && grants.unitId && unitId && unitId !== grants.unitId) {
    throw new AppError('You can only manage archived items in your unit', 403);
  }
}

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

async function purgeVehicleGraph(tx: Prisma.TransactionClient, vehicleIds: string[]) {
  if (vehicleIds.length === 0) return;

  const reservations = await tx.tbl_reservations.findMany({
    where: { reserved_vehicles: { some: { vehicle_id: { in: vehicleIds } } } },
    select: { reservation_id: true },
  });
  const reservationIds = reservations.map((row) => row.reservation_id);

  const reservedRows = await tx.tbl_reserved_vehicles.findMany({
    where: {
      OR: [
        { vehicle_id: { in: vehicleIds } },
        ...(reservationIds.length ? [{ reservation_id: { in: reservationIds } }] : []),
      ],
    },
    select: { reserved_vehicle_id: true },
  });
  const reservedIds = reservedRows.map((row) => row.reserved_vehicle_id);

  const issueIds = reservedIds.length
    ? (
        await tx.tbl_vehicle_issues.findMany({
          where: { reserved_vehicle_id: { in: reservedIds } },
          select: { issue_id: true },
        })
      ).map((issue) => issue.issue_id)
    : [];

  const maintenanceIds = (
    await tx.tbl_vehicle_maintenance.findMany({
      where: { vehicle_id: { in: vehicleIds } },
      select: { maintenance_id: true },
    })
  ).map((row) => row.maintenance_id);

  const fuelReqIds = (
    await tx.tbl_fuel_requisitions.findMany({
      where: { vehicle_id: { in: vehicleIds } },
      select: { fuel_requisition_id: true },
    })
  ).map((row) => row.fuel_requisition_id);

  if (maintenanceIds.length) {
    await tx.tbl_vehicle_maintenance_supervisors.deleteMany({
      where: { maintenance_id: { in: maintenanceIds } },
    });
    await tx.tbl_vehicle_maintenance.deleteMany({
      where: { maintenance_id: { in: maintenanceIds } },
    });
  }

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

  if (issueIds.length) {
    await tx.tbl_vehicle_issue_replies.deleteMany({
      where: { issue_id: { in: issueIds } },
    });
    await tx.tbl_vehicle_issues.deleteMany({
      where: { issue_id: { in: issueIds } },
    });
  }

  if (reservedIds.length) {
    await tx.tbl_reserved_vehicle_drivers.deleteMany({
      where: { reserved_vehicle_id: { in: reservedIds } },
    });
    await tx.tbl_vehicle_locations.deleteMany({
      where: { reserved_vehicle_id: { in: reservedIds } },
    });
    await tx.tbl_reserved_vehicles.deleteMany({
      where: { reserved_vehicle_id: { in: reservedIds } },
    });
  }

  await tx.tbl_vehicle_locations.deleteMany({
    where: { vehicle_id: { in: vehicleIds } },
  });

  if (reservationIds.length) {
    await tx.tbl_reservations.deleteMany({
      where: { reservation_id: { in: reservationIds } },
    });
  }

  if (fuelReqIds.length) {
    await tx.tbl_fuel_transactions.deleteMany({
      where: { fuel_requisition_id: { in: fuelReqIds } },
    });
    await tx.tbl_fuel_requisitions.deleteMany({
      where: { fuel_requisition_id: { in: fuelReqIds } },
    });
  }

  await tx.tbl_gps_devices.deleteMany({
    where: { vehicle_id: { in: vehicleIds } },
  });

  await tx.tbl_vehicles.deleteMany({
    where: { vehicle_id: { in: vehicleIds } },
  });
}

async function purgeUnitReservations(tx: Prisma.TransactionClient, unit_id: string) {
  const leftover = await tx.tbl_reservations.findMany({
    where: { unit_id },
    select: { reservation_id: true },
  });
  const reservationIds = leftover.map((row) => row.reservation_id);
  if (reservationIds.length === 0) return;

  const reservedRows = await tx.tbl_reserved_vehicles.findMany({
    where: { reservation_id: { in: reservationIds } },
    select: { reserved_vehicle_id: true },
  });
  const reservedIds = reservedRows.map((row) => row.reserved_vehicle_id);

  if (reservedIds.length) {
    const issueIds = (
      await tx.tbl_vehicle_issues.findMany({
        where: { reserved_vehicle_id: { in: reservedIds } },
        select: { issue_id: true },
      })
    ).map((issue) => issue.issue_id);

    await tx.tbl_vehicle_issues.updateMany({
      where: { replacement_reserved_vehicle_id: { in: reservedIds } },
      data: { replacement_reserved_vehicle_id: null },
    });
    if (issueIds.length) {
      await tx.tbl_vehicle_issue_replies.deleteMany({
        where: { issue_id: { in: issueIds } },
      });
      await tx.tbl_vehicle_issues.deleteMany({
        where: { issue_id: { in: issueIds } },
      });
    }
    await tx.tbl_reserved_vehicles.updateMany({
      where: { replaced_by_id: { in: reservedIds } },
      data: { replaced_by_id: null },
    });
    await tx.tbl_reserved_vehicle_drivers.deleteMany({
      where: { reserved_vehicle_id: { in: reservedIds } },
    });
    await tx.tbl_vehicle_locations.deleteMany({
      where: { reserved_vehicle_id: { in: reservedIds } },
    });
    await tx.tbl_reserved_vehicles.deleteMany({
      where: { reserved_vehicle_id: { in: reservedIds } },
    });
  }

  await tx.tbl_reservations.deleteMany({
    where: { reservation_id: { in: reservationIds } },
  });
}

async function purgeUnitGeneratorsAndFuel(tx: Prisma.TransactionClient, unit_id: string) {
  const generators = await tx.tbl_generators.findMany({
    where: { unit_id },
    select: { generator_id: true },
  });
  const generatorIds = generators.map((row) => row.generator_id);

  const fuelReqs = await tx.tbl_fuel_requisitions.findMany({
    where: {
      OR: [
        { unit_id },
        ...(generatorIds.length ? [{ generator_id: { in: generatorIds } }] : []),
      ],
    },
    select: { fuel_requisition_id: true },
  });
  const fuelReqIds = fuelReqs.map((row) => row.fuel_requisition_id);

  if (fuelReqIds.length) {
    await tx.tbl_fuel_transactions.deleteMany({
      where: { fuel_requisition_id: { in: fuelReqIds } },
    });
    await tx.tbl_fuel_requisitions.deleteMany({
      where: { fuel_requisition_id: { in: fuelReqIds } },
    });
  }

  if (generatorIds.length) {
    await tx.tbl_generators.deleteMany({
      where: { generator_id: { in: generatorIds } },
    });
  }
}

export async function listArchivedItemsService(grants: ArchiveGrants) {
  const orgFilter = grants.isHub ? {} : { organization_id: grants.organizationId };
  const unitFilter = grants.unitRestricted && grants.unitId ? { unit_id: grants.unitId } : {};

  const [organizations, units, positions] = await Promise.all([
    grants.organizations
      ? prisma.tbl_organizations.findMany({
          where: {
            organization_status: 'INACTIVE',
            ...(grants.isHub ? {} : { organization_id: grants.organizationId }),
          },
          orderBy: { created_at: 'desc' },
          select: {
            organization_id: true,
            organization_name: true,
            organization_email: true,
            organization_status: true,
            created_at: true,
          },
        })
      : Promise.resolve([]),
    grants.units
      ? prisma.tbl_unit.findMany({
          where: {
            status: 'INACTIVE',
            ...orgFilter,
            ...unitFilter,
          },
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
        })
      : Promise.resolve([]),
    grants.positions
      ? prisma.tbl_position.findMany({
          where: {
            position_status: 'INACTIVE',
            unit: {
              ...orgFilter,
              ...unitFilter,
            },
          },
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
        })
      : Promise.resolve([]),
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

export async function restoreOrganizationService(organization_id: string, grants: ArchiveGrants) {
  assertCan(grants, 'restore', 'organizations');

  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id },
    select: { organization_id: true, organization_status: true, organization_name: true },
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  assertTenantScope(grants, organization.organization_id);
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

export async function restoreUnitService(unit_id: string, grants: ArchiveGrants) {
  assertCan(grants, 'restore', 'units');

  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
    include: { organization: { select: { organization_status: true, organization_name: true } } },
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }
  assertTenantScope(grants, unit.organization_id, unit.unit_id);
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

export async function restorePositionService(position_id: string, grants: ArchiveGrants) {
  assertCan(grants, 'restore', 'positions');

  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: {
        select: {
          status: true,
          unit_name: true,
          unit_id: true,
          organization_id: true,
          organization: { select: { organization_status: true, organization_name: true } },
        },
      },
    },
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }
  assertTenantScope(grants, position.unit.organization_id, position.unit.unit_id);
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
  grants,
}: {
  organization_id: string;
  actorUserId: string;
  grants: ArchiveGrants;
}) {
  assertCan(grants, 'delete', 'organizations');

  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id },
    select: { organization_status: true, organization_id: true },
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  assertTenantScope(grants, organization.organization_id);
  if (organization.organization_status !== 'INACTIVE') {
    throw new AppError('Archive the organization before deleting it permanently', 400);
  }

  return deleteOrganizationPermanentlyService({ organization_id, actorUserId });
}

export async function permanentlyDeleteArchivedUnitService(unit_id: string, grants: ArchiveGrants) {
  assertCan(grants, 'delete', 'units');

  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
    include: { organization: true },
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }
  assertTenantScope(grants, unit.organization_id, unit.unit_id);
  if (unit.status !== 'INACTIVE') {
    throw new AppError('Archive the unit before deleting it permanently', 400);
  }

  const positions = await prisma.tbl_position.findMany({
    where: { unit_id },
    select: { position_id: true, position_name: true },
  });
  const protectedPosition = positions.find((position) =>
    isProtectedSuperAdminPosition(position.position_name)
  );
  if (protectedPosition) {
    throw new AppError('The SuperAdmin position cannot be deleted', 403);
  }

  const positionIds = positions.map((position) => position.position_id);
  const vehicles = await prisma.tbl_vehicles.findMany({
    where: { unit_id },
    select: { vehicle_id: true },
  });
  const vehicleIds = vehicles.map((vehicle) => vehicle.vehicle_id);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.tbl_organizations.update({
        where: { organization_id: unit.organization_id },
        data: {
          leader_unit_id:
            unit.organization.leader_unit_id === unit_id
              ? null
              : unit.organization.leader_unit_id,
          leader_position_id:
            unit.organization.leader_position_id &&
            positionIds.includes(unit.organization.leader_position_id)
              ? null
              : unit.organization.leader_position_id,
        },
      });

      await purgeVehicleGraph(tx, vehicleIds);
      await purgeUnitReservations(tx, unit_id);
      await purgeUnitGeneratorsAndFuel(tx, unit_id);

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

  return {
    unit_id,
    unit_name: unit.unit_name,
    deleted_vehicles: vehicleIds.length,
    deleted_positions: positionIds.length,
  };
}

export async function permanentlyDeleteArchivedPositionService(
  position_id: string,
  grants: ArchiveGrants
) {
  assertCan(grants, 'delete', 'positions');

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
  assertTenantScope(grants, position.unit.organization_id, position.unit.unit_id);
  if (position.position_status !== 'INACTIVE') {
    throw new AppError('Archive the position before deleting it permanently', 400);
  }
  if (isProtectedSuperAdminPosition(position.position_name)) {
    throw new AppError('The SuperAdmin position cannot be deleted', 403);
  }

  const org = position.unit.organization;

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
