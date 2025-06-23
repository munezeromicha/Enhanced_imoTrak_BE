import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../utils/Error';
import sendEmail from '../../../utils/mailSender';

const prisma = new PrismaClient();

export enum NotificationType {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  ERROR = 'ERROR',
  REQUEST = 'REQUEST',
  STATUS = 'STATUS',
  CANCEL = 'CANCEL'
}

interface SendNotificationOptions {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  sendEmailTo?: string;
  emailSubject?: string;
}

export const notificationService = {
  async sendNotification({
    userId,
    title,
    message,
    type = NotificationType.INFO,
    sendEmailTo,
    emailSubject
  }: SendNotificationOptions): Promise<void> {
    await prisma.notifications.create({
      data: { user_id: userId, title, message, type }
    });

    if (sendEmailTo && emailSubject) {
      await sendEmail({
        to: sendEmailTo,
        subject: emailSubject,
        html: message
      });
    }
  },

  async notifyFleetManagerOnRequest(requestId: string) {
    const request = await prisma.requests.findUnique({
      where: { id: requestId },
      include: {
        users_requests_requester_idTousers: {
          include: {
            organizations: {
              include: {
                users: { include: { roles: true } }
              }
            }
          }
        }
      }
    });

    if (!request) throw new AppError('Request not found', 404);
    const requester = request.users_requests_requester_idTousers;
    const organization = requester.organizations;

    if (!organization) throw new AppError('Organization not found', 404);

    const fleetManagers = organization.users.filter(
      user => user.roles?.name === 'fleetmanager'
    );

    if (fleetManagers.length === 0) {
      throw new AppError('No fleet managers found', 404);
    }

    await Promise.all(fleetManagers.map(manager =>
      this.sendNotification({
        userId: manager.id,
        title: 'New Vehicle Request Submitted',
        message: `A new trip request was submitted by ${request.full_name}.`,
        type: NotificationType.REQUEST,
        sendEmailTo: manager.email,
        emailSubject: 'New Vehicle Request Submitted'
      })
    ));
  },

  async notifyRequesterOnReview(requestId: string) {
    const request = await prisma.requests.findUnique({
      where: { id: requestId },
      include: {
        users_requests_requester_idTousers: true
      }
    });

    if (!request || !request.users_requests_requester_idTousers) {
      throw new AppError('Requester not found', 404);
    }

    const user = request.users_requests_requester_idTousers;
    const status = request.status;
    const isApproved = status === 'APPROVED';
    const statusMessage = isApproved ? 'approved' : 'rejected';

    const message = `Your trip request has been ${statusMessage}.<br/><br/>Comments: ${request.comments || 'No comments.'}`;

    await this.sendNotification({
      userId: user.id,
      title: `Your Request Was ${statusMessage.toUpperCase()}`,
      message,
      type: NotificationType.STATUS,
      sendEmailTo: user.email,
      emailSubject: `Trip Request ${statusMessage.toUpperCase()}`
    });
  },

  async notifyRequesterOnCancel(requestId: string) {
    const request = await prisma.requests.findUnique({
      where: { id: requestId },
      include: {
        users_requests_requester_idTousers: true
      }
    });

    if (!request || !request.users_requests_requester_idTousers) {
      throw new AppError('Requester not found', 404);
    }

    const user = request.users_requests_requester_idTousers;

    await this.sendNotification({
      userId: user.id,
      title: 'Your Request Was Cancelled',
      message: `Hi ${user.first_name}, your request has been cancelled.`,
      type: NotificationType.CANCEL,
      sendEmailTo: user.email,
      emailSubject: 'Trip Request Cancelled'
    });
  }
};
