import { PrismaClient } from '@prisma/client';
import { AppError } from './Error';
import type { AuthenticatedUser } from '../types/access';
import { isSuperAdmin, resolveUnitScopeForUser } from './orgLeader';

const prisma = new PrismaClient();

type VehicleScopeRow = { unit_id: string | null; organization_id: string };

export async function assertVehicleUnitScope(
  user: AuthenticatedUser,
  vehicle: VehicleScopeRow
): Promise<void> {
  if (isSuperAdmin(user)) return;

  const unitScope = await resolveUnitScopeForUser(user);

  if (vehicle.organization_id !== user.organization_id) {
    throw new AppError('You do not have access to this vehicle', 403);
  }

  if (!unitScope) return;

  if (vehicle.unit_id !== unitScope) {
    throw new AppError('You do not have access to vehicles outside your unit', 403);
  }
}

export async function assertVehicleUnitScopeById(
  user: AuthenticatedUser,
  vehicleId: string
): Promise<void> {
  const vehicle = await prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: vehicleId },
    select: { unit_id: true, organization_id: true },
  });
  if (!vehicle) throw new AppError('Vehicle not found', 404);
  await assertVehicleUnitScope(user, vehicle);
}

/** Non-leaders may only assign vehicles to their own unit. */
export async function clampVehicleUnitIdForUser(
  user: AuthenticatedUser,
  unitId: string | null | undefined
): Promise<string | null | undefined> {
  const unitScope = await resolveUnitScopeForUser(user);
  if (!unitScope) return unitId;

  if (unitId === undefined) return unitScope;
  if (unitId === null || unitId === '') return unitScope;
  if (unitId !== unitScope) {
    throw new AppError('You can only assign vehicles to your unit', 403);
  }
  return unitId;
}

export function isHubSuperAdmin(user: AuthenticatedUser): boolean {
  return !!user.position_access?.organizations?.create;
}

export async function isUserInSameOrganizationAsVehicle(
  userId: string,
  vehicleId: string
): Promise<boolean> {
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: userId },
    select: {
      position_assignments: {
        select: {
          position: {
            select: {
              unit: { select: { organization_id: true } },
            },
          },
        },
      },
    },
  });

  if (!user || user.position_assignments.length === 0) {
    return false;
  }

  const userOrgIds = user.position_assignments.map(
    (a) => a.position.unit.organization_id
  );

  const vehicle = await prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: vehicleId },
    select: { organization_id: true },
  });

  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }

  return userOrgIds.includes(vehicle.organization_id);
}

/** SuperAdmin sees all fleet; org-scoped users need vehicle/tracking permission + same org */
export async function assertVehicleLocationAccess(
  user: AuthenticatedUser,
  vehicleId: string
): Promise<void> {
  if (isHubSuperAdmin(user)) return;

  const hasVehiclePerm =
    !!user.position_access?.vehicles?.view ||
    !!user.position_access?.vehicles?.viewSingle;

  const hasTrackingLeadPerm =
    !!user.position_access?.organizations?.update ||
    (!!user.position_access?.units?.view && !!user.position_access?.users?.view);

  if (!hasVehiclePerm && !hasTrackingLeadPerm) {
    throw new AppError('You do not have permission to view this vehicle', 403);
  }

  const sameOrg = await isUserInSameOrganizationAsVehicle(user.user_id, vehicleId);
  if (!sameOrg) {
    throw new AppError('You do not have access to this vehicle', 403);
  }

  await assertVehicleUnitScopeById(user, vehicleId);
}
