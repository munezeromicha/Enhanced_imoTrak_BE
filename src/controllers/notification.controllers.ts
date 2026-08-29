import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';
import { createNotificationSchema } from '../schemas/notification.schema';
import { AuthenticatedRequest } from '../types/access';
import { authOf, type AuthorizedRequest } from '../middlewares/requirePermission';
import { isHubSuperAdmin, type AuthContext } from '../utils/authContext';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';

const notificationPrisma = new PrismaClient();

/** Refuses a recipient outside the sender's organization. */
async function assertRecipientInOrganization(ctx: AuthContext, recipientId: string) {
  if (isHubSuperAdmin(ctx)) return;

  const shares = await notificationPrisma.tbl_user_position_assignments.count({
    where: {
      user_id: recipientId,
      position: { unit: { organization_id: ctx.organizationId } },
    },
  });
  if (shares === 0) {
    throw new AppError('That user is not in your organization', 403);
  }
}


export const getUserNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user!.user_id;
    const notifications = await notificationService.getUserNotifications(user_id);
    res.json({ data: notifications });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user!.user_id;
    const notification_id = req.params.id;
    await notificationService.markNotificationAsRead(notification_id, user_id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const markAllNotificationsAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user!.user_id;
    await notificationService.markAllNotificationsAsRead(user_id);
    res.json({ message: 'All notifications marked as read' });
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

    // Previously unchecked: any signed-in user could send a notification to any
    // user in any organization. A notification inside ImoTrak carries the
    // platform's implied trust, so it needs both a permission and a recipient
    // who shares the sender's tenant.
    const ctx = authOf(req as unknown as AuthorizedRequest);
    await assertRecipientInOrganization(ctx, user_id);

    const notification = await notificationService.createNotification({ user_id, notification_title, notification_message });
    res.status(201).json({ message: 'Notification sent', data: notification });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 