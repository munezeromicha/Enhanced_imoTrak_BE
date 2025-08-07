import { z } from 'zod';

export const updateVehicleIssueMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
}); 