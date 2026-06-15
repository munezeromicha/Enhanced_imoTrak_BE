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
interface GpsDeviceInput {
  device_model?: string;
  imei: string;
  sim_number?: string;
  phone_number?: string;
  apn?: string;
  server_ip?: string;
  server_port?: number;
  firmware_version?: string;
  install_date?: string;
  notes?: string;
}

export async function createVehicle(
  data: Omit<tbl_vehicles, 'vehicle_id' | 'created_at' | 'last_service_date' | 'reservations'> & {
    gps_device?: GpsDeviceInput;
  }
) {
  const { gps_device, ...vehicleData } = data;
  await prisma.tbl_organizations.findUniqueOrThrow({ where: { organization_id: vehicleData.organization_id } });
  await prisma.tbl_vehicle_models.findUniqueOrThrow({ where: { vehicle_model_id: vehicleData.vehicle_model_id } });

  if (vehicleData.unit_id) {
    const unit = await prisma.tbl_unit.findUnique({ where: { unit_id: vehicleData.unit_id } });
    if (!unit || unit.organization_id !== vehicleData.organization_id) {
      throw new AppError('Unit not found or does not belong to this organization', 400);
    }
  }

  return prisma.$transaction(async (tx) => {
    const vehicle = await tx.tbl_vehicles.create({ data: vehicleData });

    if (gps_device?.imei) {
      await tx.tbl_gps_devices.create({
        data: {
          vehicle_id: vehicle.vehicle_id,
          device_model: gps_device.device_model ?? 'M588GS',
          imei: gps_device.imei,
          sim_number: gps_device.sim_number,
          phone_number: gps_device.phone_number,
          apn: gps_device.apn,
          server_ip: gps_device.server_ip,
          server_port: gps_device.server_port,
          firmware_version: gps_device.firmware_version,
          install_date: gps_device.install_date ? new Date(gps_device.install_date) : undefined,
          notes: gps_device.notes,
        },
      });
    }

    return tx.tbl_vehicles.findUnique({
      where: { vehicle_id: vehicle.vehicle_id },
      include: { organization: true, vehicle_model: true, unit: true, gps_device: true },
    });
  });
}

const vehicleListInclude = {
  organization: true,
  vehicle_model: true,
  unit: { select: { unit_id: true, unit_name: true } },
  gps_device: true,
} as const;

const vehicleDetailInclude = {
  organization: true,
  vehicle_model: true,
  unit: true,
  gps_device: true,
} as const;

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
        include: vehicleListInclude,
      });
    } catch {
      // Invalid range or past dates: return all vehicles
      return prisma.tbl_vehicles.findMany({
        where: { organization_id: organizationId },
        include: vehicleListInclude,
      });
    }
  }

  return prisma.tbl_vehicles.findMany({
    where: {
      organization_id: organizationId,
    },
    include: vehicleListInclude,
  });
}

export async function getVehicleById(id: string) {
  // Avoid eager-loading locations here (can be large and has caused production failures when schema drift exists).
  // Location history is available via /v2/vehicles/:id/locations.
  return prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: id },
    include: vehicleDetailInclude,
  });
}

export async function updateVehicle(
  id: string,
  data: Partial<Omit<tbl_vehicles, 'vehicle_id' | 'created_at' | 'last_service_date' | 'reservations'>> & {
    gps_device?: GpsDeviceInput;
  },
) {
  const { gps_device, ...rawVehicleData } = data;
  const vehicleData = { ...rawVehicleData } as Partial<Omit<tbl_vehicles, 'vehicle_id' | 'created_at' | 'last_service_date' | 'reservations'>>;

  if (vehicleData.unit_id === null || vehicleData.unit_id === ('' as unknown as string)) {
    vehicleData.unit_id = null;
  }

  const existing = await prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: id },
    select: { organization_id: true },
  });
  if (!existing) {
    throw new AppError('Vehicle not found', 404);
  }

  if (vehicleData.unit_id) {
    const unit = await prisma.tbl_unit.findUnique({ where: { unit_id: vehicleData.unit_id } });
    if (!unit || unit.organization_id !== existing.organization_id) {
      throw new AppError('Unit not found or does not belong to this organization', 400);
    }
  }

  const dataToWrite = { ...vehicleData };
  // Never pass relation objects or GPS payload to tbl_vehicles.update
  delete (dataToWrite as Record<string, unknown>).gps_device;
  delete (dataToWrite as Record<string, unknown>).organization;
  delete (dataToWrite as Record<string, unknown>).vehicle_model;
  delete (dataToWrite as Record<string, unknown>).unit;

  if (Object.keys(dataToWrite).length > 0) {
    await prisma.tbl_vehicles.update({ where: { vehicle_id: id }, data: dataToWrite });
  }

  if (gps_device?.imei) {
    await prisma.tbl_gps_devices.upsert({
      where: { vehicle_id: id },
      create: {
        vehicle_id: id,
        device_model: gps_device.device_model ?? 'M588GS',
        imei: gps_device.imei,
        sim_number: gps_device.sim_number,
        phone_number: gps_device.phone_number,
        apn: gps_device.apn,
        server_ip: gps_device.server_ip,
        server_port: gps_device.server_port,
        firmware_version: gps_device.firmware_version,
        install_date: gps_device.install_date ? new Date(gps_device.install_date) : undefined,
        notes: gps_device.notes,
      },
      update: {
        device_model: gps_device.device_model ?? 'M588GS',
        imei: gps_device.imei,
        sim_number: gps_device.sim_number,
        phone_number: gps_device.phone_number,
        apn: gps_device.apn,
        server_ip: gps_device.server_ip,
        server_port: gps_device.server_port,
        firmware_version: gps_device.firmware_version,
        install_date: gps_device.install_date ? new Date(gps_device.install_date) : undefined,
        notes: gps_device.notes,
        updated_at: new Date(),
      },
    });
  }

  return prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: id },
    include: vehicleDetailInclude,
  });
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

  vehicleLocations.set(vehicle_id, location);

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

export function parseStoredCoords(raw: unknown): Coords | null {
  if (!raw) return null;
  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  const c = parsed as Coords;
  if (typeof c.latitude !== 'number' || typeof c.longitude !== 'number') return null;
  return c;
}

export async function getLatestLocation(vehicleId: string): Promise<Location | null> {
  const cached = vehicleLocations.get(vehicleId);
  if (cached) return cached;

  const row = await prisma.tbl_vehicle_locations.findFirst({
    where: { vehicle_id: vehicleId },
    orderBy: { timestamp: 'desc' },
  });
  if (!row) return null;

  const coords = parseStoredCoords(row.coords);
  if (!coords) return null;

  const location: Location = {
    vehicle_id: vehicleId,
    reserved_vehicle_id: row.reserved_vehicle_id ?? undefined,
    coords,
    timestamp: row.timestamp.toISOString(),
  };
  vehicleLocations.set(vehicleId, location);
  return location;
}

export async function getVehicleTrackingContext(vehicleId: string) {
  const vehicle = await prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: vehicleId },
    select: {
      vehicle_id: true,
      plate_number: true,
      vehicle_status: true,
      energy_type: true,
    },
  });
  if (!vehicle) return null;

  const activeTrip = await prisma.tbl_reserved_vehicles.findFirst({
    where: {
      vehicle_id: vehicleId,
      returned_date: null,
      reservation: {
        reservation_status: { in: ['APPROVED', 'IN_PROGRESS'] },
      },
    },
    orderBy: { created_at: 'desc' },
    include: {
      reservation: {
        select: {
          reservation_id: true,
          reservation_status: true,
          departure_date: true,
          expected_returning_date: true,
        },
      },
      drivers: {
        where: { is_active: true },
        include: {
          driver: {
            include: {
              user: {
                select: {
                  first_name: true,
                  last_name: true,
                  user_phone: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const latest = await getLatestLocation(vehicleId);

  return {
    vehicle,
    active_trip: activeTrip
      ? {
          reserved_vehicle_id: activeTrip.reserved_vehicle_id,
          starting_odometer: activeTrip.starting_odometer,
          fuel_provided: activeTrip.fuel_provided,
          reservation_status: activeTrip.reservation.reservation_status,
          drivers: activeTrip.drivers.map((a) => ({
            driver_id: a.driver.driver_id,
            name: `${a.driver.user.first_name} ${a.driver.user.last_name}`.trim(),
            license_number: a.driver.license_number,
            phone: a.driver.user.user_phone,
          })),
        }
      : null,
    latest_location: latest,
  };
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

