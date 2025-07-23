import { PrismaClient } from '@prisma/client';
import { transporter } from '../utils/mailer';

const prisma = new PrismaClient();

export async function createNotification({ user_id, notification_title, notification_message, email }: { user_id: string, notification_title: string, notification_message: string, email?: string }) {
  // Create system notification
  const notification = await prisma.tbl_notifications.create({
    data: { user_id, notification_title, notification_message },
  });
  // Send email if provided
  if (email) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: notification_title,
      text: notification_message + '\n\nClick here to view: ' + process.env.FRONTEND_URL + '/notifications',
    });
  }
  return notification;
}

export async function getUserNotifications(user_id: string) {
  return prisma.tbl_notifications.findMany({
    where: { user_id },
    orderBy: { created_at: 'desc' },
  });
}

export async function deleteNotification(notification_id: string, user_id: string) {
  // Only allow user to delete their own notification
  return prisma.tbl_notifications.delete({
    where: { notification_id, user_id },
  });
} 