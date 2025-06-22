import { PrismaClient, requests, vehicles } from '@prisma/client';
import { AppError } from '../../../utils/Error';


const prisma = new PrismaClient();


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

export const fleetRequest = {

      // Get all requests for the staff member
      getRequests: async (managerId: string): Promise<RequestResponse[]> => {

        const manager = await prisma.users.findUnique({
            where: {id: managerId}
        });

        if(!manager)
            throw new AppError("This account is no longer available:", 409)

        const requests = await prisma.requests.findMany({
            where: {
            users_requests_requester_idTousers: {
                organization_id: manager?.organization_id,
            },
            },
            include: {
            vehicles: true,
            users_requests_requester_idTousers: {
                select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                },
            },
            },
            orderBy: {
            requested_at: "desc",
            },
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
}