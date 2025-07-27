import { PrismaClient, tbl_vehicle_models, tbl_vehicles } from '@prisma/client';

const prisma = new PrismaClient();

// Vehicle Model Services
export async function createVehicleModel(data: Omit<tbl_vehicle_models, 'vehicle_model_id' | 'created_at' | 'vehicles'>) {
  return prisma.tbl_vehicle_models.create({ data });
}

export async function getAllVehicleModels() {
  return prisma.tbl_vehicle_models.findMany();
}

export async function getVehicleModelById(id: string) {
  return prisma.tbl_vehicle_models.findUnique({ where: { vehicle_model_id: id } });
}

export async function updateVehicleModel(id: string, data: Partial<Omit<tbl_vehicle_models, 'vehicle_model_id' | 'created_at' | 'ehicles'>>) {
  return prisma.tbl_vehicle_models.update({ where: { vehicle_model_id: id }, data });
}

export async function deleteVehicleModel(id: string) {
  return prisma.tbl_vehicle_models.delete({ where: { vehicle_model_id: id } });
}

// Vehicle Services
export async function createVehicle(data: Omit<tbl_vehicles, 'vehicle_id' | 'created_at' | 'last_service_date' | 'reservations'>) {
  // Ensure organization and vehicle_model exist
  await prisma.tbl_organizations.findUniqueOrThrow({ where: { organization_id: data.organization_id } });
  await prisma.tbl_vehicle_models.findUniqueOrThrow({ where: { vehicle_model_id: data.vehicle_model_id } });
  return prisma.tbl_vehicles.create({ data });
}

export async function getAllVehicles(userId: string) {
  // Get user's organization
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: userId },
    include: {
      positions: {
        include: {
          unit: {
            include: {
              organization: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.positions.length) {
    throw new Error('User not found or has no position');
  }

  const orgId = user.positions[0].unit.organization.organization_id;

  // Get all vehicles from the same organization
  return prisma.tbl_vehicles.findMany({
    where: {
      organization_id: orgId,
    },
    include: { 
      organization: true, 
      vehicle_model: true 
    },
  });
}

export async function getVehicleById(id: string) {
  return prisma.tbl_vehicles.findUnique({ where: { vehicle_id: id }, include: { organization: true, vehicle_model: true } });
}

export async function updateVehicle(id: string, data: Partial<Omit<tbl_vehicles, 'vehicle_id' | 'created_at' | 'last_service_date' | 'reservations'>>) {
  return prisma.tbl_vehicles.update({ where: { vehicle_id: id }, data });
}

export async function deleteVehicle(id: string) {
  return prisma.tbl_vehicles.delete({ where: { vehicle_id: id } });
} 