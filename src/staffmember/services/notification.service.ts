import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../utils/Error';
import  sendEmail from '../../../utils/mailSender';

const prisma = new PrismaClient();

interface mailOptions {
  from?: string;
  to: string;
  subject: string;
  html: string;
}


export const notificationService = {
  // Create notification in DB and optionally send email
  sendNotification: async ({
    userId,
    title,
    message,
    type = 'INFO',
    sendEmailTo,
    emailSubject
  }: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    sendEmailTo?: string;
    emailSubject?: string;
  }) => {
    // Save notification
    await prisma.notifications.create({
      data: {
        user_id: userId,
        title,
        message,
        type,
      }
    });

    // Optionally send email
    if (sendEmailTo && emailSubject) {
      await sendEmail({
        to: sendEmailTo,
        subject: emailSubject,
        html: message
      });
    }
  },
  
  notifyFleetManagerOnRequest: async (requestId: string) => {
    const request = await prisma.requests.findUnique({
      where: { id: requestId },
      include: {
        users_requests_requester_idTousers: {
          include: {
            organizations: {
              include: {
                users: {
                  include: { roles: true }
                }
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

    if (!fleetManagers.length) throw new AppError('No fleet managers found', 404);

    await Promise.all(fleetManagers.map(manager =>
      notificationService.sendNotification({
        userId: manager.id,
        title: 'New Vehicle Request Submitted',
        message: `A new trip request was submitted by ${request.full_name}.`,
        type: 'REQUEST',
        sendEmailTo: manager.email,
        emailSubject: 'New Vehicle Request Submitted'
      })
    ));
  },

  notifyRequesterOnReview: async (requestId: string) => {
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
    const statusMessage = request.status === 'APPROVED' ? 'approved' : 'rejected';
    const message = `Your trip request has been ${statusMessage}.\n\nComments: ${request.comments || 'No comments.'}`;

    await notificationService.sendNotification({
      userId: user.id,
      title: `Your Request Was ${statusMessage.toUpperCase()}`,
      message,
      type: 'STATUS',
      sendEmailTo: user.email,
      emailSubject: `Trip Request ${statusMessage.toUpperCase()}`
    });
  },

  notifyRequesterOnCancel: async (requestId: string) => {
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

    await notificationService.sendNotification({
      userId: user.id,
      title: 'Your Request Was Cancelled',
      message: `Hi ${user.first_name}, your request has been cancelled.`,
      type: 'CANCEL',
      sendEmailTo: user.email,
      emailSubject: 'Trip Request Cancelled'
    });
  }
};
