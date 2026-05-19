import { z } from 'zod';

export const createDriverSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  license_number: z.string().min(1, 'License number is required'),
  license_category: z.string().min(1, 'License category is required'),
  experience_years: z.number().int().nonnegative('Experience years must be positive'),
});

export const updateDriverSchema = z.object({
  license_number: z.string().min(1).optional(),
  license_category: z.string().min(1).optional(),
  experience_years: z.number().int().nonnegative().optional(),
  driver_status: z.enum(['AVAILABLE', 'ON_TRIP', 'INACTIVE']).optional(),
});

export const issueReplySchema = z.object({
  reply_content: z.string().min(1, 'Reply content cannot be empty'),
});

export const approveReplacementSchema = z.object({
  replacement_vehicle_id: z.string().uuid('Invalid replacement vehicle ID'),
  replacement_driver_id: z.string().uuid('Invalid replacement driver ID'),
});
