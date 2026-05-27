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

export async function sendVehicleIssueEmailNotification({ user_id, to_email, issue_title, message, sender_name, issue_id }: { 
  user_id: string;
  to_email: string; 
  issue_title: string; 
  message: string; 
  sender_name: string; 
  issue_id: string; 
}) {
  const notification_title = issue_title;
  const notification_message = message;
  const notification = await prisma.tbl_notifications.create({
    data: { user_id, notification_title, notification_message },
  });
  const emailSubject = `New Message on Vehicle Issue: ${issue_title}`;
  const emailBody = `
Greetings, Turabasuhuje,

A new message has been added to your vehicle issue: "${issue_title}"

Message from ${sender_name}:
"${message}"

You can view the full issue details by clicking the link below:
${process.env.FRONTEND_URL}/issues/${issue_id}

Best regards,
IMOTRAK, Binary Hub
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to_email,
    subject: emailSubject,
    text: emailBody,
  });
}

export async function getUserNotifications(user_id: string) {
  return prisma.tbl_notifications.findMany({
    where: { user_id },
    orderBy: { created_at: 'desc' },
  });
}

export async function markAllNotificationsAsRead(user_id: string) {
  await prisma.tbl_notifications.updateMany({
    where: { user_id, is_read: false },
    data: { is_read: true },
  });
}

export async function markNotificationAsRead(notification_id: string, user_id: string) {
  // Use updateMany to avoid requiring a compound unique constraint
  const result = await prisma.tbl_notifications.updateMany({
    where: { notification_id, user_id },
    data: { is_read: true },
  });
  if (result.count === 0) {
    throw new Error('Notification not found');
  }
  return result;
}

export async function deleteNotification(notification_id: string, user_id: string) {
  // Only allow user to delete their own notification
  return prisma.tbl_notifications.delete({
    where: { notification_id, user_id },
  });
} 