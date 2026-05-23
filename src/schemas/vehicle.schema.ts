import { z } from 'zod';

export const vehicleModelSchema = z.object({
  vehicle_model_name: z.string().min(1),
  vehicle_type: z.enum([
    'AMBULANCE', 'SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE', 'BUS', 'OTHER'
  ]),
  manufacturer_name: z.string().min(1),
  vehicle_capacity: z.coerce.number().int().min(1),
});

export const vehicleModelUpdateSchema = vehicleModelSchema.partial();

export const vehicleSchema = z.object({
  plate_number: z.string().min(1),
  transmission_mode: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC']),
  vehicle_model_id: z.string().uuid(),
  // vehicle_type: z.enum(['AMBULANCE', 'SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE', 'BUS', 'OTHER']),
  // vehicle_photo: z.string().min(1),
  vehicle_year: z.coerce.number().int().min(1900),
  vehicle_status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_SERVICE']).optional(),
  energy_type: z.string().min(1),
  last_service_date: z.string().datetime().optional(),
  organization_id: z.string().uuid(),
});

export const locationUpdateSchema = z.object({
  vehicle_id: z.string(),
  coords: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      altitude: z.number().nullable(),
      accuracy: z.number().min(0),
      altitudeAccuracy: z.number().min(0).nullable(),
      heading: z.number().min(0).max(360).nullable(),
      speed: z.number().min(0).nullable(),
      fuel_litres: z.number().min(0).optional(),
      battery_voltage: z.number().min(0).optional(),
      battery_kwh: z.number().min(0).optional(),
      odometer_km: z.number().min(0).optional(),
      imei: z.string().optional(),
      ignition: z.boolean().optional(),
      movement: z.boolean().optional(),
    })
    .passthrough(),
  timestamp: z.number().int() // Unix time in milliseconds
});

export const vehicleUpdateSchema = vehicleSchema.partial().extend({
  vehicle_model_id: z.string().uuid().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  organization_id: z.string().uuid().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
});