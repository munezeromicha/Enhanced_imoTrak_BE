import { z } from 'zod';

export const vehicleModelSchema = z.object({
  vehicle_model_name: z.string().min(1),
  vehicle_type: z.enum([
    'AMBULANCE', 'SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE', 'BUS', 'OTHER'
  ]),
  manufacturer_name: z.string().min(1),
});

export const vehicleModelUpdateSchema = vehicleModelSchema.partial();

export const vehicleSchema = z.object({
  plate_number: z.string().min(1),
  transmission_mode: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC']),
  vehicle_model_id: z.string().uuid(),
  // vehicle_type: z.enum(['AMBULANCE', 'SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE', 'BUS', 'OTHER']),
  vehicle_photo: z.string().min(1),
  vehicle_year: z.number().int().min(1900),
  vehicle_capacity: z.number().int().min(1),
  vehicle_status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_SERVICE']).optional(),
  energy_type: z.string().min(1),
  last_service_date: z.string().datetime().optional(),
  organization_id: z.string().uuid(),
});

export const vehicleUpdateSchema = vehicleSchema.partial(); 