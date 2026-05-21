import { PrismaClient, tbl_vehicle_models, tbl_vehicles } from '@prisma/client';
import { Response } from 'express';
import { ServerResponse } from 'http';
import { AppError } from '../utils/Error';
import * as reservationService from './reservation.services';

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

/**
 * Get all vehicles for an organization.
 * When startDate and endDate are provided, returns only vehicles available for that date range (for reservation).
 */
export async function getAllVehicles(
  organizationId: string,
  startDate?: string,
  endDate?: string
) {
  const useAvailabilityFilter =
    startDate &&
    endDate &&
    startDate.trim() !== '' &&
    endDate.trim() !== '';

  if (useAvailabilityFilter) {
    try {
      const available = await reservationService.getAvailableVehiclesForDateRange(
        startDate,
        endDate,
        organizationId
      );
      const vehicleIds = available.map((v) => v.vehicle_id);
      if (vehicleIds.length === 0) {
        return [];
      }
      return prisma.tbl_vehicles.findMany({
        where: {
          organization_id: organizationId,
          vehicle_id: { in: vehicleIds },
        },
        include: {
          organization: true,
          vehicle_model: true,
        },
      });
    } catch {
      // Invalid range or past dates: return all vehicles
      return prisma.tbl_vehicles.findMany({
        where: { organization_id: organizationId },
        include: { organization: true, vehicle_model: true },
      });
    }
  }

  return prisma.tbl_vehicles.findMany({
    where: {
      organization_id: organizationId,
    },
    include: {
      organization: true,
      vehicle_model: true,
    },
  });
}

export async function getVehicleById(id: string) {
  // Avoid eager-loading locations here (can be large and has caused production failures when schema drift exists).
  // Location history is available via /v2/vehicles/:id/locations.
  return prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: id },
    include: { organization: true, vehicle_model: true },
  });
}

export async function updateVehicle(id: string, data: Partial<Omit<tbl_vehicles, 'vehicle_id' | 'created_at' | 'last_service_date' | 'reservations'>>) {
  return prisma.tbl_vehicles.update({ where: { vehicle_id: id }, data });
}

export async function deleteVehicle(id: string) {
  return prisma.tbl_vehicles.delete({ where: { vehicle_id: id } });
} 


// Location Services
type SSEResponse = Response & ServerResponse;
interface Coords {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface Location {
  vehicle_id: string;
  reserved_vehicle_id?: string;   // ties the ping to a specific trip
  coords: Coords;
  timestamp: string | number | Date;
}

const vehicleLocations = new Map<string, Location>();           // vehicle_id -> latest location
const vehicleClients = new Map<string, Set<Response>>();        // vehicle_id -> Set of SSE response objects

export async function saveAndBroadcastLocation(location: Location): Promise<void> {
  const { vehicle_id } = location;
  if (!vehicle_id) return;

  // Save the latest location
  await prisma.tbl_vehicle_locations.create({
    data: {
      vehicle_id,
      reserved_vehicle_id: location.reserved_vehicle_id ?? null,
      coords: JSON.stringify(location.coords),
      timestamp: new Date(location.timestamp as string | number),
    },
  });

  const data = `data: ${JSON.stringify(location)}\n\n`;

  // Broadcast to all SSE clients watching this vehicle
  const clients = vehicleClients.get(vehicle_id);
  if (clients) {
    for (const res of clients) {
      res.write(data);
    }
  }
}

export async function addSSEClient(vehicleId: string, res: Response): Promise<void> {
  if (!vehicleClients.has(vehicleId)) {
    vehicleClients.set(vehicleId, new Set());
  }

  vehicleClients.get(vehicleId)!.add(res);

  // Clean up when the client disconnects
  res.on('close', () => {
    const clients = vehicleClients.get(vehicleId);
    if (!clients) return;

    clients.delete(res);
    if (clients.size === 0) {
      vehicleClients.delete(vehicleId);
    }
  });
}

export async function getLatestLocation(vehicleId: string): Promise<Location | null> {
  return vehicleLocations.get(vehicleId) || null;
}

export async function getVehicleLocationHistory(
  vehicleId: string,
  reservedVehicleId?: string,
) {
  return prisma.tbl_vehicle_locations.findMany({
    where: {
      vehicle_id: vehicleId,
      ...(reservedVehicleId ? { reserved_vehicle_id: reservedVehicleId } : {}),
    },
    orderBy: { timestamp: 'asc' },
  });
}

// Also allow fetching a trip's path directly by reserved_vehicle_id alone
export async function getTripLocationHistory(reservedVehicleId: string) {
  return prisma.tbl_vehicle_locations.findMany({
    where: { reserved_vehicle_id: reservedVehicleId },
    orderBy: { timestamp: 'asc' },
  });
}

export async function isUserInSameOrganizationAsVehicle(userId: string, vehicleId: string): Promise<boolean> {
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: userId },
    select: {
      position_assignments: {
        select: {
          position: {
            select: {
              unit: {
                select: { organization_id: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user || user.position_assignments.length === 0) {
    throw new AppError('User or user organizations not found', 404);
  }

  const userOrgIds = user.position_assignments.map(
    (a) => a.position.unit.organization_id
  );

  const vehicle = await prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: vehicleId },
    select: { organization_id: true }
  });

  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }

  return userOrgIds.includes(vehicle.organization_id);
}

