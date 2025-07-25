// src/schemas/reservation.schema.ts
import { z } from 'zod';

export const createReservationSchema = z.object({
  reservation_purpose: z.string(),
  start_location: z.string(),
  reservation_destination: z.string(),
  departure_date: z.string().datetime(),
  expected_returning_date: z.string().datetime(),
  description: z.string().min(1),
  passengers: z.number().int().min(1),
});

export const cancelReservationSchema = z.object({
  reason: z.string().min(1),
});

export const updateReservationStatusSchema = z.object({
  status: z.string(), // Optionally use z.nativeEnum(RequestStatus) if imported
  reason: z.string().optional(),
});

export const assignVehicleSchema = z.object({
  vehicle_id: z.string().min(1),
});

export const startReservationSchema = z.object({});

export const odometerFuelSchema = z.object({
  starting_odometer: z.number().int().min(0),
  fuel_provided: z.number().int().min(0),
});

export const completeReservationSchema = z.object({
  returned_odometer: z.number().int().min(0),
}); 