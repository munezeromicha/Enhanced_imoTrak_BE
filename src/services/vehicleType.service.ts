import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';

const prisma = new PrismaClient();

/**
 * Types a given organisation may use: the global defaults (organization_id null)
 * plus any the org has added. Sorted defaults-first, then alphabetically.
 */
export async function listVehicleTypesForOrg(organizationId: string | undefined) {
  const types = await prisma.tbl_vehicle_types.findMany({
    where: {
      OR: [{ organization_id: null }, ...(organizationId ? [{ organization_id: organizationId }] : [])],
    },
    orderBy: [{ is_default: 'desc' }, { name: 'asc' }],
  });
  return types;
}

/** Set of allowed type names for validating a vehicle model's type. */
export async function getAllowedTypeNames(organizationId: string | undefined): Promise<Set<string>> {
  const types = await listVehicleTypesForOrg(organizationId);
  return new Set(types.map((t) => t.name));
}

export async function createVehicleType(name: string, organizationId: string) {
  const clean = name.trim();

  // Reject if it duplicates a global default or one the org already has.
  const existing = await prisma.tbl_vehicle_types.findFirst({
    where: {
      name: { equals: clean, mode: 'insensitive' },
      OR: [{ organization_id: null }, { organization_id: organizationId }],
    },
  });
  if (existing) {
    throw new AppError('That vehicle type already exists.', 409);
  }

  return prisma.tbl_vehicle_types.create({
    data: { name: clean, is_default: false, organization_id: organizationId },
  });
}

export async function deleteVehicleType(vehicleTypeId: string, organizationId: string) {
  const type = await prisma.tbl_vehicle_types.findUnique({
    where: { vehicle_type_id: vehicleTypeId },
  });
  if (!type) throw new AppError('Vehicle type not found.', 404);
  if (type.is_default || type.organization_id === null) {
    throw new AppError('Built-in vehicle types cannot be deleted.', 400);
  }
  if (type.organization_id !== organizationId) {
    throw new AppError('You can only delete vehicle types your organisation created.', 403);
  }

  // Block deletion while models still reference it, to avoid orphaned types.
  const inUse = await prisma.tbl_vehicle_models.count({ where: { vehicle_type: type.name } });
  if (inUse > 0) {
    throw new AppError(`This type is used by ${inUse} vehicle model(s) and cannot be deleted.`, 409);
  }

  await prisma.tbl_vehicle_types.delete({ where: { vehicle_type_id: vehicleTypeId } });
}
