import { z } from 'zod';

export const createNotificationSchema = z.object({
  user_id: z.string().uuid(),
  notification_title: z.string().min(1),
  notification_message: z.string().min(1),
});

export const notificationResponseSchema = z.object({
  notification_id: z.string().uuid(),
  user_id: z.string().uuid(),
  notification_title: z.string(),
  notification_message: z.string(),
  created_at: z.string().datetime(),
}); 