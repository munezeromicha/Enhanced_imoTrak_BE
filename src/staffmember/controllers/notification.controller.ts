import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const NotificationController = {
  async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { type, since } = req.query;
      const sinceDate = since ? new Date(since as string) : undefined;

      const notifications = await notificationService.getNotifications(
        req.user!.id,
        type as string,
        sinceDate
      );

      res.json(notifications);
    } catch (err) {
      next(err);
    }
  },

  async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await notificationService.markAllAsRead(req.user!.id);
      res.json({ message: 'All notifications marked as read.' });
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await notificationService.markAsRead(req.params.id, req.user!.id);
      res.json({ message: 'Notification marked as read.' });
    } catch (err) {
      next(err);
    }
  },

  async deleteNotification(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await notificationService.deleteNotification(req.params.id, req.user!.id);
      res.json({ message: 'Notification deleted.' });
    } catch (err) {
      next(err);
    }
  }
};
