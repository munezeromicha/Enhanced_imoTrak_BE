import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type NotificationType = "SUCCESS" | "INFO" | "ERROR";

export const notificationService = {
  send: async (
    userId: string,
    type: NotificationType,
    title: string,
    message: string
  ) => {
    return await prisma.notification.create({
      data: {
        user_id: userId,
        type,
        title,
        message,
      },
    });
  },

  markAllAsRead: async (userId: string) => {
    return await prisma.notification.updateMany({
      where: {
        user_id: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  },

  getUserNotifications: async (userId: string) => {
    return await prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
  },
};
