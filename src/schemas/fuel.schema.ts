import { z } from 'zod';

export const fuelRequestTypeEnum = z.enum(['VEHICLE', 'GENERATOR']);

export const fuelRequisitionStatusEnum = z.enum([
  'SUBMITTED',
  'RECOMMENDED',
  'FUNDING_CONFIRMED',
  'ISSUED',
  'RECEIVED',
  'REJECTED',
  'CANCELLED',
]);

const litres = z
  .number({ message: 'Quantity must be a number' })
  .positive('Quantity must be greater than zero')
  .max(100000, 'Quantity looks too large');

/**
 * Section I of the form. A vehicle request carries a logbook reading in km; a
 * generator request carries a gauge percentage instead, because a generator has
 * no odometer. The refinements below keep those two shapes from being mixed.
 */
export const createFuelRequisitionSchema = z
  .object({
    request_type: fuelRequestTypeEnum,
    vehicle_id: z.string().uuid('vehicle_id must be a valid UUID').optional(),
    generator_id: z.string().uuid('generator_id must be a valid UUID').optional(),
    quantity_requested_litres: litres,
    odometer_km: z
      .number()
      .int('Logbook reading must be a whole number of kilometres')
      .nonnegative()
      .optional(),
    fuel_indicator_percent: z
      .number()
      .int('Gauge reading must be a whole percentage')
      .min(0)
      .max(100, 'Gauge reading cannot exceed 100%')
      .optional(),
    purpose: z
      .string()
      .trim()
      .min(3, 'Say what the fuel is for')
      .max(500),
  })
  .superRefine((value, ctx) => {
    if (value.request_type === 'VEHICLE') {
      if (!value.vehicle_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['vehicle_id'],
          message: 'Pick the vehicle this fuel is for',
        });
      }
      if (value.odometer_km === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['odometer_km'],
          message: 'Record the logbook reading in kilometres',
        });
      }
      return;
    }

    if (!value.generator_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['generator_id'],
        message: 'Pick the generator this fuel is for',
      });
    }
    if (value.fuel_indicator_percent === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fuel_indicator_percent'],
        message: 'Record the fuel gauge reading as a percentage',
      });
    }
  });

/** Section II — Assets and Services Management. */
export const recommendFuelRequisitionSchema = z.object({
  note: z.string().trim().max(1000).optional(),
});

/**
 * Section IV — what the logistics desk actually handed over. Left open for the
 * supplied quantity to differ from the quantity requested, because on the paper
 * form it routinely does.
 */
export const issueFuelRequisitionSchema = z.object({
  quantity_supplied_litres: litres,
  amount_rwf: z
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be greater than zero')
    .max(1_000_000_000),
  issued_on: z.coerce.date().optional(),
});

export const rejectFuelRequisitionSchema = z.object({
  reason: z.string().trim().min(3, 'Give a reason').max(1000),
});

export const createGeneratorSchema = z.object({
  generator_name: z.string().trim().min(2, 'Name the generator').max(160),
  generator_code: z.string().trim().max(60).optional(),
  location: z.string().trim().max(160).optional(),
  unit_id: z.string().uuid().optional(),
  fuel_level_percent: z.number().int().min(0).max(100).optional(),
});

export const updateGeneratorSchema = createGeneratorSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const replenishFuelAccountSchema = z.object({
  amount_rwf: z
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be greater than zero')
    .max(1_000_000_000),
  description: z.string().trim().max(300).optional(),
  occurred_on: z.coerce.date().optional(),
});

export type CreateFuelRequisitionInput = z.infer<typeof createFuelRequisitionSchema>;
export type IssueFuelRequisitionInput = z.infer<typeof issueFuelRequisitionSchema>;
export type CreateGeneratorInput = z.infer<typeof createGeneratorSchema>;
export type UpdateGeneratorInput = z.infer<typeof updateGeneratorSchema>;
export type ReplenishFuelAccountInput = z.infer<typeof replenishFuelAccountSchema>;
