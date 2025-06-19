import { PrismaClient, requests, vehicles } from '@prisma/client';
import { AppError } from '../../../utils/Error';

const prisma = new PrismaClient();

interface CreateRequestData {
  vehicle_id?: string;
  trip_purpose: string;
  start_location: string;
  end_location: string;
  start_date: string;
  end_date: string;
  full_name: string;
  passengers_number: number;
  comments?: string;
}

interface RequestResponse {
  id: string;
  vehicle_id: string | null;
  requested_at: Date;
  trip_purpose: string;
  start_location: string;
  end_location: string;
  start_date: Date;
  end_date: Date;
  status: string;
  reviewed_at: Date | null;
  comments: string | null;
  requester_id: string;
  reviewed_by: string | null;
  full_name: string;
  passengers_number: number;
  vehicle?: {
    id: string;
    plate_number: string;
    vehicle_type: string;
    vehicle_model: string;
    manufacturer: string | null;
    year: number | null;
    capacity: number | null;
    status: string;
  };
  requester: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const RequestService = {
  // Get all requests for the staff member
  getMyRequests: async (staffMemberId: string): Promise<RequestResponse[]> => {
    const staffMember = await prisma.users.findUnique({
      where: { id: staffMemberId },
      include: {
        roles: true
      }
    });

    if (!staffMember) {
      throw new AppError('Staff member not found', 404);
    }

    if (staffMember.roles.name !== 'staff') {
      throw new AppError('Access denied. Only staff members can view their requests', 403);
    }

    const requests = await prisma.requests.findMany({
      where: {
        requester_id: staffMemberId
      },
      include: {
        vehicles: true,
        users_requests_requester_idTousers: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      },
      orderBy: {
        requested_at: 'desc'
      }
    });

    return requests.map(request => ({
      id: request.id,
      vehicle_id: request.vehicle_id,
      requested_at: request.requested_at,
      trip_purpose: request.trip_purpose,
      start_location: request.start_location,
      end_location: request.end_location,
      start_date: request.start_date,
      end_date: request.end_date,
      status: request.status,
      reviewed_at: request.reviewed_at,
      comments: request.comments,
      requester_id: request.requester_id,
      reviewed_by: request.reviewed_by,
      full_name: request.full_name,
      passengers_number: request.passengers_number,
      vehicle: request.vehicles ? {
        id: request.vehicles.id,
        plate_number: request.vehicles.plate_number,
        vehicle_type: request.vehicles.vehicle_type,
        vehicle_model: request.vehicles.vehicle_model,
        manufacturer: request.vehicles.manufacturer,
        year: request.vehicles.year,
        capacity: request.vehicles.capacity,
        status: request.vehicles.status
      } : undefined,
      requester: request.users_requests_requester_idTousers
    }));
  },

  // Get request by ID (only if it belongs to the staff member)
  getRequestById: async (requestId: string, staffMemberId: string): Promise<RequestResponse | null> => {
    const staffMember = await prisma.users.findUnique({
      where: { id: staffMemberId },
      include: {
        roles: true
      }
    });

    if (!staffMember) {
      throw new AppError('Staff member not found', 404);
    }

    if (staffMember.roles.name !== 'staff') {
      throw new AppError('Access denied. Only staff members can view their requests', 403);
    }

    const request = await prisma.requests.findFirst({
      where: {
        id: requestId,
        requester_id: staffMemberId
      },
      include: {
        vehicles: true,
        users_requests_requester_idTousers: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      }
    });

    if (!request) {
      return null;
    }

    return {
      id: request.id,
      vehicle_id: request.vehicle_id,
      requested_at: request.requested_at,
      trip_purpose: request.trip_purpose,
      start_location: request.start_location,
      end_location: request.end_location,
      start_date: request.start_date,
      end_date: request.end_date,
      status: request.status,
      reviewed_at: request.reviewed_at,
      comments: request.comments,
      requester_id: request.requester_id,
      reviewed_by: request.reviewed_by,
      full_name: request.full_name,
      passengers_number: request.passengers_number,
      vehicle: request.vehicles ? {
        id: request.vehicles.id,
        plate_number: request.vehicles.plate_number,
        vehicle_type: request.vehicles.vehicle_type,
        vehicle_model: request.vehicles.vehicle_model,
        manufacturer: request.vehicles.manufacturer,
        year: request.vehicles.year,
        capacity: request.vehicles.capacity,
        status: request.vehicles.status
      } : undefined,
      requester: request.users_requests_requester_idTousers
    };
  },

  // Get available vehicles for the staff member's organization
  getAvailableVehicles: async (staffMemberId: string): Promise<any[]> => {
    const staffMember = await prisma.users.findUnique({
      where: { id: staffMemberId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!staffMember) {
      throw new AppError('Staff member not found', 404);
    }

    if (staffMember.roles.name !== 'staff') {
      throw new AppError('Access denied. Only staff members can view available vehicles', 403);
    }

    const vehicles = await prisma.vehicles.findMany({
      where: {
        organization_id: staffMember.organization_id,
        status: 'AVAILABLE'
      },
      select: {
        id: true,
        plate_number: true,
        vehicle_type: true,
        vehicle_model: true,
        manufacturer: true,
        year: true,
        capacity: true,
        odometer: true,
        fuel_type: true,
        last_service_date: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return vehicles;
  },

  // Create new request
  createRequest: async (data: CreateRequestData, staffMemberId: string): Promise<RequestResponse> => {
    const staffMember = await prisma.users.findUnique({
      where: { id: staffMemberId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!staffMember) {
      throw new AppError('Staff member not found', 404);
    }

    if (staffMember.roles.name !== 'staff') {
      throw new AppError('Access denied. Only staff members can create requests', 403);
    }

    // Validate required fields
    if (!data.trip_purpose || !data.start_location || !data.end_location || 
        !data.start_date || !data.end_date || !data.full_name) {
      throw new AppError('Missing required fields', 400);
    }

    // Validate dates
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const now = new Date();

    if (startDate < now) {
      throw new AppError('Start date cannot be in the past', 400);
    }

    if (endDate <= startDate) {
      throw new AppError('End date must be after start date', 400);
    }

    // Validate passengers number
    if (data.passengers_number < 1) {
      throw new AppError('Passengers number must be at least 1', 400);
    }

    // If vehicle_id is provided, validate it exists and is available
    if (data.vehicle_id) {
      const vehicle = await prisma.vehicles.findFirst({
        where: {
          id: data.vehicle_id,
          organization_id: staffMember.organization_id,
          status: 'AVAILABLE'
        }
      });

      if (!vehicle) {
        throw new AppError('Vehicle not found or not available', 400);
      }

      // Check if vehicle has enough capacity
      if (vehicle.capacity && data.passengers_number > vehicle.capacity) {
        throw new AppError(`Vehicle capacity (${vehicle.capacity}) is less than requested passengers (${data.passengers_number})`, 400);
      }
    }

    const requestData: any = {
      trip_purpose: data.trip_purpose,
      start_location: data.start_location,
      end_location: data.end_location,
      start_date: startDate,
      end_date: endDate,
      full_name: data.full_name,
      passengers_number: data.passengers_number,
      requester_id: staffMemberId,
      comments: data.comments
    };

    if (data.vehicle_id) {
      requestData.vehicle_id = data.vehicle_id;
    }

    const request = await prisma.requests.create({
      data: requestData,
      include: {
        vehicles: true,
        users_requests_requester_idTousers: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      }
    });

    return {
      id: request.id,
      vehicle_id: request.vehicle_id,
      requested_at: request.requested_at,
      trip_purpose: request.trip_purpose,
      start_location: request.start_location,
      end_location: request.end_location,
      start_date: request.start_date,
      end_date: request.end_date,
      status: request.status,
      reviewed_at: request.reviewed_at,
      comments: request.comments,
      requester_id: request.requester_id,
      reviewed_by: request.reviewed_by,
      full_name: request.full_name,
      passengers_number: request.passengers_number,
      vehicle: request.vehicles ? {
        id: request.vehicles.id,
        plate_number: request.vehicles.plate_number,
        vehicle_type: request.vehicles.vehicle_type,
        vehicle_model: request.vehicles.vehicle_model,
        manufacturer: request.vehicles.manufacturer,
        year: request.vehicles.year,
        capacity: request.vehicles.capacity,
        status: request.vehicles.status
      } : undefined,
      requester: request.users_requests_requester_idTousers
    };
  },

  // Update request (only if it's pending and belongs to the staff member)
  updateRequest: async (requestId: string, data: Partial<CreateRequestData>, staffMemberId: string): Promise<RequestResponse> => {
    const staffMember = await prisma.users.findUnique({
      where: { id: staffMemberId },
      include: {
        roles: true
      }
    });

    if (!staffMember) {
      throw new AppError('Staff member not found', 404);
    }

    if (staffMember.roles.name !== 'staff') {
      throw new AppError('Access denied. Only staff members can update their requests', 403);
    }

    // Check if request exists and belongs to the staff member
    const existingRequest = await prisma.requests.findFirst({
      where: {
        id: requestId,
        requester_id: staffMemberId,
        status: 'PENDING'
      }
    });

    if (!existingRequest) {
      throw new AppError('Request not found or cannot be updated', 404);
    }

    // Validate dates if provided
    if (data.start_date || data.end_date) {
      const startDate = data.start_date ? new Date(data.start_date) : existingRequest.start_date;
      const endDate = data.end_date ? new Date(data.end_date) : existingRequest.end_date;
      const now = new Date();

      if (startDate < now) {
        throw new AppError('Start date cannot be in the past', 400);
      }

      if (endDate <= startDate) {
        throw new AppError('End date must be after start date', 400);
      }
    }

    // Validate passengers number if provided
    if (data.passengers_number !== undefined && data.passengers_number < 1) {
      throw new AppError('Passengers number must be at least 1', 400);
    }

    const updateData: any = {};

    if (data.trip_purpose !== undefined) updateData.trip_purpose = data.trip_purpose;
    if (data.start_location !== undefined) updateData.start_location = data.start_location;
    if (data.end_location !== undefined) updateData.end_location = data.end_location;
    if (data.start_date !== undefined) updateData.start_date = new Date(data.start_date);
    if (data.end_date !== undefined) updateData.end_date = new Date(data.end_date);
    if (data.full_name !== undefined) updateData.full_name = data.full_name;
    if (data.passengers_number !== undefined) updateData.passengers_number = data.passengers_number;
    if (data.comments !== undefined) updateData.comments = data.comments;

    const updatedRequest = await prisma.requests.update({
      where: { id: requestId },
      data: updateData,
      include: {
        vehicles: true,
        users_requests_requester_idTousers: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      }
    });

    return {
      id: updatedRequest.id,
      vehicle_id: updatedRequest.vehicle_id,
      requested_at: updatedRequest.requested_at,
      trip_purpose: updatedRequest.trip_purpose,
      start_location: updatedRequest.start_location,
      end_location: updatedRequest.end_location,
      start_date: updatedRequest.start_date,
      end_date: updatedRequest.end_date,
      status: updatedRequest.status,
      reviewed_at: updatedRequest.reviewed_at,
      comments: updatedRequest.comments,
      requester_id: updatedRequest.requester_id,
      reviewed_by: updatedRequest.reviewed_by,
      full_name: updatedRequest.full_name,
      passengers_number: updatedRequest.passengers_number,
      vehicle: updatedRequest.vehicles ? {
        id: updatedRequest.vehicles.id,
        plate_number: updatedRequest.vehicles.plate_number,
        vehicle_type: updatedRequest.vehicles.vehicle_type,
        vehicle_model: updatedRequest.vehicles.vehicle_model,
        manufacturer: updatedRequest.vehicles.manufacturer,
        year: updatedRequest.vehicles.year,
        capacity: updatedRequest.vehicles.capacity,
        status: updatedRequest.vehicles.status
      } : undefined,
      requester: updatedRequest.users_requests_requester_idTousers
    };
  },

  // Cancel request (only if it's pending and belongs to the staff member)
  cancelRequest: async (requestId: string, staffMemberId: string): Promise<void> => {
    const staffMember = await prisma.users.findUnique({
      where: { id: staffMemberId },
      include: {
        roles: true
      }
    });

    if (!staffMember) {
      throw new AppError('Staff member not found', 404);
    }

    if (staffMember.roles.name !== 'staff') {
      throw new AppError('Access denied. Only staff members can cancel their requests', 403);
    }

    // Check if request exists and belongs to the staff member
    const existingRequest = await prisma.requests.findFirst({
      where: {
        id: requestId,
        requester_id: staffMemberId,
        status: 'PENDING'
      }
    });

    if (!existingRequest) {
      throw new AppError('Request not found or cannot be cancelled', 404);
    }

    await prisma.requests.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' }
    });
  }
}; 