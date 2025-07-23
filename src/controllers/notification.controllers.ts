import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';
import { createNotificationSchema } from '../schemas/notification.schema';
import { AuthenticatedRequest } from '../types/access';

export const getUserNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user!.user_id;
    const notifications = await notificationService.getUserNotifications(user_id);
    res.json({ data: notifications });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user!.user_id;
    const notification_id = req.params.id;
    await notificationService.deleteNotification(notification_id, user_id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Optional: for testing notification creation
export const sendNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id, notification_title, notification_message } = createNotificationSchema.parse(req.body);
    const notification = await notificationService.createNotification({ user_id, notification_title, notification_message });
    res.status(201).json({ message: 'Notification sent', data: notification });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 