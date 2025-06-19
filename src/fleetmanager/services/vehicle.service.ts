import { PrismaClient, vehicles } from '@prisma/client';
import { AppError } from '../../../utils/Error';

const prisma = new PrismaClient();

const VALID_VEHICLE_STATUSES = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_SERVICE'] as const;
type VehicleStatus = typeof VALID_VEHICLE_STATUSES[number];

interface CreateVehicleData {
  plate_number: string;
  vehicle_type: string;
  vehicle_model: string;
  manufacturer?: string;
  year?: number;
  capacity?: number;
  odometer: number;
  status: VehicleStatus;
  fuel_type?: string;
  last_service_date?: string;
}

interface UpdateVehicleData {
  plate_number?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  manufacturer?: string;
  year?: number;
  capacity?: number;
  odometer?: number;
  status?: VehicleStatus;
  fuel_type?: string;
  last_service_date?: string;
}

interface VehicleResponse {
  id: string;
  plate_number: string;
  vehicle_type: string;
  vehicle_model: string;
  manufacturer: string | null;
  year: number | null;
  capacity: number | null;
  odometer: number;
  status: VehicleStatus;
  fuel_type: string | null;
  last_service_date: Date | null;
  created_at: Date;
  organization_name: string;
}

export const VehicleService = {
  // Get all vehicles in the fleet manager's organization
  getVehicles: async (fleetManagerId: string): Promise<VehicleResponse[]> => {
    // First get the fleet manager to get their organization
    const fleetManager = await prisma.users.findUnique({
      where: { id: fleetManagerId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!fleetManager) {
      throw new AppError('Fleet manager not found', 404);
    }

    if (fleetManager.roles.name !== 'fleetmanager') {
      throw new AppError('Access denied. Only fleet managers can view vehicles', 403);
    }

    const vehicles = await prisma.vehicles.findMany({
      where: {
        organization_id: fleetManager.organization_id
      },
      include: {
        organizations: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return vehicles.map(vehicle => ({
      id: vehicle.id,
      plate_number: vehicle.plate_number,
      vehicle_type: vehicle.vehicle_type,
      vehicle_model: vehicle.vehicle_model,
      manufacturer: vehicle.manufacturer,
      year: vehicle.year,
      capacity: vehicle.capacity,
      odometer: vehicle.odometer,
      status: vehicle.status,
      fuel_type: vehicle.fuel_type,
      last_service_date: vehicle.last_service_date,
      created_at: vehicle.created_at,
      organization_name: vehicle.organizations.name
    }));
  },

  // Get vehicle by ID (only if it belongs to the same organization)
  getById: async (vehicleId: string, fleetManagerId: string): Promise<VehicleResponse | null> => {
    // First get the fleet manager to get their organization
    const fleetManager = await prisma.users.findUnique({
      where: { id: fleetManagerId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!fleetManager) {
      throw new AppError('Fleet manager not found', 404);
    }

    if (fleetManager.roles.name !== 'fleetmanager') {
      throw new AppError('Access denied. Only fleet managers can view vehicles', 403);
    }

    const vehicle = await prisma.vehicles.findFirst({
      where: {
        id: vehicleId,
        organization_id: fleetManager.organization_id
      },
      include: {
        organizations: true
      }
    });

    if (!vehicle) {
      return null;
    }

    return {
      id: vehicle.id,
      plate_number: vehicle.plate_number,
      vehicle_type: vehicle.vehicle_type,
      vehicle_model: vehicle.vehicle_model,
      manufacturer: vehicle.manufacturer,
      year: vehicle.year,
      capacity: vehicle.capacity,
      odometer: vehicle.odometer,
      status: vehicle.status,
      fuel_type: vehicle.fuel_type,
      last_service_date: vehicle.last_service_date,
      created_at: vehicle.created_at,
      organization_name: vehicle.organizations.name
    };
  },

  // Create new vehicle
  createVehicle: async (data: CreateVehicleData, fleetManagerId: string): Promise<VehicleResponse> => {
    // First get the fleet manager to get their organization and verify permissions
    const fleetManager = await prisma.users.findUnique({
      where: { id: fleetManagerId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!fleetManager) {
      throw new AppError('Fleet manager not found', 404);
    }

    if (fleetManager.roles.name !== 'fleetmanager') {
      throw new AppError('Access denied. Only fleet managers can create vehicles', 403);
    }

    // Validate vehicle status
    if (!VALID_VEHICLE_STATUSES.includes(data.status)) {
      throw new AppError('Invalid vehicle status', 400);
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (data.year !== undefined && (data.year < 1900 || data.year > currentYear + 1)) {
      throw new AppError('Invalid vehicle year', 400);
    }

    // Validate odometer
    if (data.odometer < 0) {
      throw new AppError('Odometer cannot be negative', 400);
    }

    // Validate capacity if provided
    if (data.capacity !== undefined && data.capacity <= 0) {
      throw new AppError('Capacity must be positive', 400);
    }

    const vehicleData: any = {
      plate_number: data.plate_number,
      vehicle_type: data.vehicle_type,
      vehicle_model: data.vehicle_model,
      manufacturer: data.manufacturer,
      year: data.year,
      capacity: data.capacity,
      odometer: data.odometer,
      status: data.status,
      fuel_type: data.fuel_type,
      organization_id: fleetManager.organization_id
    };

    if (data.last_service_date) {
      vehicleData.last_service_date = new Date(data.last_service_date);
    }

    const vehicle = await prisma.vehicles.create({
      data: vehicleData,
      include: {
        organizations: true
      }
    });

    return {
      id: vehicle.id,
      plate_number: vehicle.plate_number,
      vehicle_type: vehicle.vehicle_type,
      vehicle_model: vehicle.vehicle_model,
      manufacturer: vehicle.manufacturer,
      year: vehicle.year,
      capacity: vehicle.capacity,
      odometer: vehicle.odometer,
      status: vehicle.status,
      fuel_type: vehicle.fuel_type,
      last_service_date: vehicle.last_service_date,
      created_at: vehicle.created_at,
      organization_name: vehicle.organizations.name
    };
  },

  // Update vehicle
  updateVehicle: async (vehicleId: string, data: UpdateVehicleData, fleetManagerId: string): Promise<VehicleResponse> => {
    // First get the fleet manager to get their organization and verify permissions
    const fleetManager = await prisma.users.findUnique({
      where: { id: fleetManagerId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!fleetManager) {
      throw new AppError('Fleet manager not found', 404);
    }

    if (fleetManager.roles.name !== 'fleetmanager') {
      throw new AppError('Access denied. Only fleet managers can update vehicles', 403);
    }

    // Verify the vehicle belongs to the same organization
    const existingVehicle = await prisma.vehicles.findFirst({
      where: {
        id: vehicleId,
        organization_id: fleetManager.organization_id
      }
    });

    if (!existingVehicle) {
      throw new AppError('Vehicle not found or access denied', 404);
    }

    // Validate vehicle status if provided
    if (data.status && !VALID_VEHICLE_STATUSES.includes(data.status)) {
      throw new AppError('Invalid vehicle status', 400);
    }

    // Validate year if provided
    if (data.year !== undefined) {
      const currentYear = new Date().getFullYear();
      if (data.year < 1900 || data.year > currentYear + 1) {
        throw new AppError('Invalid vehicle year', 400);
      }
    }

    // Validate odometer if provided
    if (data.odometer !== undefined && data.odometer < 0) {
      throw new AppError('Odometer cannot be negative', 400);
    }

    // Validate capacity if provided
    if (data.capacity !== undefined && data.capacity <= 0) {
      throw new AppError('Capacity must be positive', 400);
    }

    const updateData: any = {};

    if (data.plate_number !== undefined) updateData.plate_number = data.plate_number;
    if (data.vehicle_type !== undefined) updateData.vehicle_type = data.vehicle_type;
    if (data.vehicle_model !== undefined) updateData.vehicle_model = data.vehicle_model;
    if (data.manufacturer !== undefined) updateData.manufacturer = data.manufacturer;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.odometer !== undefined) updateData.odometer = data.odometer;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.fuel_type !== undefined) updateData.fuel_type = data.fuel_type;
    if (data.last_service_date !== undefined) {
      updateData.last_service_date = new Date(data.last_service_date);
    }

    const updatedVehicle = await prisma.vehicles.update({
      where: { id: vehicleId },
      data: updateData,
      include: {
        organizations: true
      }
    });

    return {
      id: updatedVehicle.id,
      plate_number: updatedVehicle.plate_number,
      vehicle_type: updatedVehicle.vehicle_type,
      vehicle_model: updatedVehicle.vehicle_model,
      manufacturer: updatedVehicle.manufacturer,
      year: updatedVehicle.year,
      capacity: updatedVehicle.capacity,
      odometer: updatedVehicle.odometer,
      status: updatedVehicle.status,
      fuel_type: updatedVehicle.fuel_type,
      last_service_date: updatedVehicle.last_service_date,
      created_at: updatedVehicle.created_at,
      organization_name: updatedVehicle.organizations.name
    };
  },

  // Delete vehicle
  deleteVehicle: async (vehicleId: string, fleetManagerId: string): Promise<void> => {
    // First get the fleet manager to get their organization and verify permissions
    const fleetManager = await prisma.users.findUnique({
      where: { id: fleetManagerId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!fleetManager) {
      throw new AppError('Fleet manager not found', 404);
    }

    if (fleetManager.roles.name !== 'fleetmanager') {
      throw new AppError('Access denied. Only fleet managers can delete vehicles', 403);
    }

    // Verify the vehicle belongs to the same organization
    const existingVehicle = await prisma.vehicles.findFirst({
      where: {
        id: vehicleId,
        organization_id: fleetManager.organization_id
      }
    });

    if (!existingVehicle) {
      throw new AppError('Vehicle not found or access denied', 404);
    }

    // Check if vehicle has any associated trips or requests
    const hasTrips = await prisma.trips.findFirst({
      where: { vehicle_id: vehicleId }
    });

    const hasRequests = await prisma.requests.findFirst({
      where: { vehicle_id: vehicleId }
    });

    if (hasTrips || hasRequests) {
      throw new AppError('Cannot delete vehicle with associated trips or requests', 400);
    }

    await prisma.vehicles.delete({
      where: { id: vehicleId }
    });
  },

  // Get vehicle status options
  getVehicleStatuses: (): { value: string; label: string }[] => {
    return [
      { value: 'AVAILABLE', label: 'Available' },
      { value: 'OCCUPIED', label: 'Occupied' },
      { value: 'MAINTENANCE', label: 'Maintenance' },
      { value: 'OUT_OF_SERVICE', label: 'Out of Service' }
    ];
  }
}; 