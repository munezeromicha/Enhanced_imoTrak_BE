import { PrismaClient } from '@prisma/client';
import { AuthenticatedUser } from '../types/access';
import { AppError } from '../utils/Error';
import {
  CreateMaintenanceInput,
  UpdateMaintenanceInput,
  CompleteMaintenanceInput,
  CancelMaintenanceInput,
  AssignSupervisorInput,
} from '../schemas/maintenance.schema';

const prisma = new PrismaClient();

/** Statuses that mean the job is still occupying the vehicle. */
const OPEN_STATUSES = ['SCHEDULED', 'IN_PROGRESS'] as const;

const supervisorInclude = {
  supervisors: {
    include: {
      user: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          user_photo: true,
          user_phone: true,
        },
      },
    },
    orderBy: { assigned_at: 'desc' as const },
  },
  created_by: {
    select: { user_id: true, first_name: true, last_name: true, user_photo: true },
  },
  vehicle: {
    select: {
      vehicle_id: true,
      plate_number: true,
      vehicle_status: true,
      organization_id: true,
      vehicle_model: { select: { vehicle_model_name: true, manufacturer_name: true } },
    },
  },
};

/**
 * A user belongs to an organization through position -> unit -> organization.
 * There is no organization_id column on tbl_users, so membership must be
 * derived. Mirrors the scoping in getUsersWithPositionsService.
 *
 * The supervisor is checked against the VEHICLE's organization rather than the
 * caller's: a job on org X's vehicle must be led by someone inside org X, even
 * when a super-admin opens it.
 */
async function assertUserInOrganization(user_id: string, organization_id: string) {
  const member = await prisma.tbl_users.findFirst({
    where: {
      user_id,
      position_assignments: {
        some: { position: { unit: { organization_id } } },
      },
    },
    select: { user_id: true },
  });

  if (!member) {
    const exists = await prisma.tbl_users.findUnique({
      where: { user_id },
      select: { user_id: true },
    });
    throw new AppError(
      exists
        ? "The selected supervisor does not belong to this vehicle's organization."
        : 'Supervisor user not found.',
      exists ? 403 : 404
    );
  }

  return member;
}

/** Vehicles are organization-scoped; never let a caller reach another org's data. */
async function assertVehicleInOrg(vehicle_id: string, user: AuthenticatedUser) {
  const vehicle = await prisma.tbl_vehicles.findUnique({
    where: { vehicle_id },
    select: { vehicle_id: true, organization_id: true, vehicle_status: true },
  });
  if (!vehicle) throw new AppError('Vehicle not found.', 404);
  if (vehicle.organization_id !== user.organization_id) {
    throw new AppError('Access denied. This vehicle belongs to another organization.', 403);
  }
  return vehicle;
}

async function getScopedMaintenance(maintenance_id: string, user: AuthenticatedUser) {
  const record = await prisma.tbl_vehicle_maintenance.findUnique({
    where: { maintenance_id },
    include: supervisorInclude,
  });
  if (!record) throw new AppError('Maintenance record not found.', 404);
  if (record.vehicle.organization_id !== user.organization_id) {
    throw new AppError('Access denied. This record belongs to another organization.', 403);
  }
  return record;
}

/** Full maintenance history for one vehicle, newest first. */
export const getMaintenanceForVehicle = async (vehicle_id: string, user: AuthenticatedUser) => {
  await assertVehicleInOrg(vehicle_id, user);
  return prisma.tbl_vehicle_maintenance.findMany({
    where: { vehicle_id },
    include: supervisorInclude,
    orderBy: { created_at: 'desc' },
  });
};

/** Every maintenance record across the caller's organization. */
export const getAllMaintenance = async (user: AuthenticatedUser, status?: string) => {
  return prisma.tbl_vehicle_maintenance.findMany({
    where: {
      vehicle: { organization_id: user.organization_id },
      ...(status ? { status: status as any } : {}),
    },
    include: supervisorInclude,
    orderBy: { created_at: 'desc' },
  });
};

export const getMaintenanceById = async (maintenance_id: string, user: AuthenticatedUser) => {
  return getScopedMaintenance(maintenance_id, user);
};

export const createMaintenance = async (input: CreateMaintenanceInput, user: AuthenticatedUser) => {
  const vehicle = await assertVehicleInOrg(input.vehicle_id, user);

  // One open job per vehicle keeps "is this car in maintenance?" unambiguous.
  const existing = await prisma.tbl_vehicle_maintenance.findFirst({
    where: { vehicle_id: input.vehicle_id, status: { in: [...OPEN_STATUSES] } },
  });
  if (existing) {
    throw new AppError(
      'This vehicle already has an Assign maintenance job. Complete or cancel it first.',
      409
    );
  }

  const supervisorId = input.supervisor_user_id ?? user.user_id;
  await assertUserInOrganization(supervisorId, vehicle.organization_id);

  const startNow = input.start_now ?? !input.scheduled_date;

  return prisma.$transaction(async (tx) => {
    const record = await tx.tbl_vehicle_maintenance.create({
      data: {
        vehicle_id: input.vehicle_id,
        title: input.title,
        description: input.description,
        maintenance_type: input.maintenance_type ?? 'CORRECTIVE',
        status: startNow ? 'IN_PROGRESS' : 'SCHEDULED',
        scheduled_date: input.scheduled_date,
        started_at: startNow ? new Date() : null,
        service_provider: input.service_provider,
        odometer_km: input.odometer_km,
        created_by_user_id: user.user_id,
        supervisors: {
          create: { user_id: supervisorId, is_active: true },
        },
      },
      include: supervisorInclude,
    });

    // Only take the vehicle off the road once work actually starts.
    if (startNow) {
      await tx.tbl_vehicles.update({
        where: { vehicle_id: input.vehicle_id },
        data: { vehicle_status: 'MAINTENANCE' },
      });
    }

    return record;
  });
};

export const updateMaintenance = async (
  maintenance_id: string,
  input: UpdateMaintenanceInput,
  user: AuthenticatedUser
) => {
  const record = await getScopedMaintenance(maintenance_id, user);
  if (record.status === 'COMPLETED' || record.status === 'CANCELLED') {
    throw new AppError('This maintenance job is closed and can no longer be edited.', 400);
  }

  return prisma.tbl_vehicle_maintenance.update({
    where: { maintenance_id },
    data: { ...input },
    include: supervisorInclude,
  });
};

/** Move a SCHEDULED job to IN_PROGRESS and flag the vehicle. */
export const startMaintenance = async (maintenance_id: string, user: AuthenticatedUser) => {
  const record = await getScopedMaintenance(maintenance_id, user);
  if (record.status !== 'SCHEDULED') {
    throw new AppError(`Cannot start a job that is ${record.status}.`, 400);
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.tbl_vehicle_maintenance.update({
      where: { maintenance_id },
      data: { status: 'IN_PROGRESS', started_at: new Date() },
      include: supervisorInclude,
    });
    await tx.tbl_vehicles.update({
      where: { vehicle_id: record.vehicle_id },
      data: { vehicle_status: 'MAINTENANCE' },
    });
    return updated;
  });
};

export const completeMaintenance = async (
  maintenance_id: string,
  input: CompleteMaintenanceInput,
  user: AuthenticatedUser
) => {
  const record = await getScopedMaintenance(maintenance_id, user);
  if (record.status === 'COMPLETED' || record.status === 'CANCELLED') {
    throw new AppError('This maintenance job is already closed.', 400);
  }

  const completedAt = new Date();

  return prisma.$transaction(async (tx) => {
    const updated = await tx.tbl_vehicle_maintenance.update({
      where: { maintenance_id },
      data: {
        status: 'COMPLETED',
        completed_at: completedAt,
        work_performed: input.work_performed,
        cost: input.cost,
        currency: input.currency,
        odometer_km: input.odometer_km ?? record.odometer_km,
      },
      include: supervisorInclude,
    });

    // Close out the active supervisor so the row reads as historical.
    await tx.tbl_vehicle_maintenance_supervisors.updateMany({
      where: { maintenance_id, is_active: true },
      data: { is_active: false, unassigned_at: completedAt },
    });

    await tx.tbl_vehicles.update({
      where: { vehicle_id: record.vehicle_id },
      data: {
        vehicle_status: input.restore_vehicle_status ?? 'AVAILABLE',
        last_service_date: completedAt,
      },
    });

    return updated;
  });
};

export const cancelMaintenance = async (
  maintenance_id: string,
  input: CancelMaintenanceInput,
  user: AuthenticatedUser
) => {
  const record = await getScopedMaintenance(maintenance_id, user);
  if (record.status === 'COMPLETED' || record.status === 'CANCELLED') {
    throw new AppError('This maintenance job is already closed.', 400);
  }

  const cancelledAt = new Date();

  return prisma.$transaction(async (tx) => {
    const updated = await tx.tbl_vehicle_maintenance.update({
      where: { maintenance_id },
      data: { status: 'CANCELLED', cancel_reason: input.cancel_reason },
      include: supervisorInclude,
    });

    await tx.tbl_vehicle_maintenance_supervisors.updateMany({
      where: { maintenance_id, is_active: true },
      data: { is_active: false, unassigned_at: cancelledAt },
    });

    // Only hand the vehicle back if this job was the reason it was off the road.
    if (record.status === 'IN_PROGRESS') {
      await tx.tbl_vehicles.update({
        where: { vehicle_id: record.vehicle_id },
        data: { vehicle_status: input.restore_vehicle_status ?? 'AVAILABLE' },
      });
    }

    return updated;
  });
};

/**
 * Hand the job to a different supervisor. The outgoing row is retained with
 * is_active = false so the history shows who *was* in control and when.
 */
export const assignSupervisor = async (
  maintenance_id: string,
  input: AssignSupervisorInput,
  user: AuthenticatedUser
) => {
  const record = await getScopedMaintenance(maintenance_id, user);
  if (record.status === 'COMPLETED' || record.status === 'CANCELLED') {
    throw new AppError('This maintenance job is closed; its supervisor cannot change.', 400);
  }

  await assertUserInOrganization(input.user_id, record.vehicle.organization_id);

  const current = record.supervisors.find((s) => s.is_active);
  if (current?.user_id === input.user_id) {
    throw new AppError('That user is already leading this maintenance job.', 400);
  }

  const now = new Date();

  return prisma.$transaction(async (tx) => {
    await tx.tbl_vehicle_maintenance_supervisors.updateMany({
      where: { maintenance_id, is_active: true },
      data: { is_active: false, unassigned_at: now, handover_note: input.handover_note },
    });

    await tx.tbl_vehicle_maintenance_supervisors.create({
      data: { maintenance_id, user_id: input.user_id, is_active: true, assigned_at: now },
    });

    return tx.tbl_vehicle_maintenance.findUnique({
      where: { maintenance_id },
      include: supervisorInclude,
    });
  });
};

export const deleteMaintenance = async (maintenance_id: string, user: AuthenticatedUser) => {
  await getScopedMaintenance(maintenance_id, user);
  // Supervisor rows cascade via the FK.
  await prisma.tbl_vehicle_maintenance.delete({ where: { maintenance_id } });
};
