import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notificationService';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { AppError } from '../../../utils/Error';

export const NotificationController = {
  // Get all notifications (with optional filters)
  getAll: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { read, hoursAgo } = req.query;

      const notifications = await notificationService.getAll(
        req.user!.id,
        read !== undefined ? read === 'true' : undefined,
        hoursAgo ? parseInt(hoursAgo as string, 10) : undefined
      );

      res.json(notifications);
    } catch (error: any) {
      return next(error);
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await notificationService.markAllAsRead(req.user!.id);
      res.json({ message: 'All notifications marked as read' });
    } catch (error: any) {
      return next(error);
    }
  },

  // Mark specific notifications as read/unread
  markAs: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { ids, read } = req.body;

      if (!Array.isArray(ids) || typeof read !== 'boolean') {
        return next(new AppError('Invalid request body. Expected { ids: string[], read: boolean }', 400));
      }

      await notificationService.markAs(ids, read);

      res.json({ message: `Marked ${read ? 'as read' : 'as unread'}` });
    } catch (error: any) {
      return next(error);
    }
  },

  // Get user's notifications without filters (if needed)
  getUserNotifications: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const notifications = await notificationService.getUserNotifications(req.user!.id);
      res.json(notifications);
    } catch (error: any) {
      return next(error);
    }
  },

  // Send a manual notification (optional admin/utility route)
  send: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { userId, type, title, message } = req.body;

      if (!userId || !type || !title || !message) {
        return next(new AppError('Missing required fields', 400));
      }

      const created = await notificationService.send(userId, type, title, message);
      res.status(201).json({
        message: 'Notification sent successfully',
        notification: created,
      });
    } catch (error: any) {
      return next(error);
    }
  },
};
