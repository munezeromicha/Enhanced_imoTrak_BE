import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type NotificationType = "SUCCESS" | "INFO" | "ERROR";

export const notificationService = {
  // Create a notification
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

  // Mark all as read
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

  // Get all notifications (with optional filters)
  getAll: async (
    userId: string,
    read?: boolean,
    hoursAgo?: number
  ) => {
    const filter: any = {
      user_id: userId,
    };

    if (read !== undefined) {
      filter.read = read;
    }

    if (hoursAgo) {
      const fromDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      filter.created_at = { gte: fromDate };
    }

    return await prisma.notification.findMany({
      where: filter,
      orderBy: { created_at: "desc" },
    });
  },

  // Mark specific notifications as read/unread
  markAs: async (
    ids: string[],
    read: boolean
  ) => {
    return await prisma.notification.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        read,
      },
    });
  },

  // Get user notifications (no filters)
  getUserNotifications: async (userId: string) => {
    return await prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
  },
};
