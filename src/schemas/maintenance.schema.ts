import { z } from 'zod';

export const maintenanceTypeEnum = z.enum([
  'PREVENTIVE',
  'CORRECTIVE',
  'INSPECTION',
  'REPAIR',
  'TIRE',
  'BODYWORK',
  'OTHER',
]);

export const maintenanceStatusEnum = z.enum([
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export const createMaintenanceSchema = z.object({
  vehicle_id: z.string().uuid('vehicle_id must be a valid UUID'),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(160),
  description: z.string().trim().max(2000).optional(),
  maintenance_type: maintenanceTypeEnum.optional(),
  /// Omit to start the job immediately (IN_PROGRESS); provide to schedule it.
  scheduled_date: z.coerce.date().optional(),
  service_provider: z.string().trim().max(160).optional(),
  odometer_km: z.number().int().nonnegative().optional(),
  /// Person leading the job. Defaults to the caller when omitted.
  supervisor_user_id: z.string().uuid().optional(),
  /// When true the vehicle is flagged MAINTENANCE straight away.
  start_now: z.boolean().optional(),
});

export const updateMaintenanceSchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  description: z.string().trim().max(2000).optional(),
  maintenance_type: maintenanceTypeEnum.optional(),
  scheduled_date: z.coerce.date().optional(),
  service_provider: z.string().trim().max(160).optional(),
  odometer_km: z.number().int().nonnegative().optional(),
  cost: z.number().nonnegative().optional(),
  currency: z.string().trim().min(1).max(8).optional(),
  work_performed: z.string().trim().max(2000).optional(),
});

export const completeMaintenanceSchema = z.object({
  work_performed: z.string().trim().min(3, 'Describe the work performed').max(2000),
  cost: z.number().nonnegative().optional(),
  currency: z.string().trim().min(1).max(8).optional(),
  odometer_km: z.number().int().nonnegative().optional(),
  /// Status to restore the vehicle to once the job closes.
  restore_vehicle_status: z.enum(['AVAILABLE', 'OUT_OF_SERVICE']).optional(),
});

export const cancelMaintenanceSchema = z.object({
  cancel_reason: z.string().trim().min(3, 'Give a reason for cancelling').max(500),
  restore_vehicle_status: z.enum(['AVAILABLE', 'OUT_OF_SERVICE']).optional(),
});

export const assignSupervisorSchema = z.object({
  user_id: z.string().uuid('user_id must be a valid UUID'),
  handover_note: z.string().trim().max(500).optional(),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceSchema>;
export type CompleteMaintenanceInput = z.infer<typeof completeMaintenanceSchema>;
export type CancelMaintenanceInput = z.infer<typeof cancelMaintenanceSchema>;
export type AssignSupervisorInput = z.infer<typeof assignSupervisorSchema>;
