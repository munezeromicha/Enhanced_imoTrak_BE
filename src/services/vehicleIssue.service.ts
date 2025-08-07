import { PrismaClient,  tbl_vehicle_issues } from '@prisma/client';
import { AuthenticatedUser } from '../types/access';
import { AppError } from '../utils/Error';
import { createNotification, sendVehicleIssueEmailNotification } from './notification.service';
const prisma = new PrismaClient();

export const getAllIssues = async ( user: AuthenticatedUser) => {
  const {organization_id} = user;
  const issues = await prisma.tbl_vehicle_issues.findMany({
    where: {
      reserved_vehicle: {
        vehicle: {
          organization_id: organization_id,
        },
      },
    },
    include: {
      reserved_vehicle:{
        include:{
          vehicle: true,
          reservation: {
            include: {
              user: {
                include: {
                  auth: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
            },
          }
        }
      }
    }
  });
  return issues;
};

export const getIssueById = async (id: string, user: AuthenticatedUser) => {
  const issue = await prisma.tbl_vehicle_issues.findUnique({
    where: { issue_id: id },
    include: {
      reserved_vehicle: {
        include:{
          vehicle: true,
          reservation: {
            include: {
              user: {
                include: {
                  auth: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
            },
          }
        }
      }
    }
  });

  if (!issue) 
    throw new AppError('No vehicle issue found', 404);

  if (issue.reserved_vehicle.vehicle.organization_id !== user.organization_id)
    throw new AppError('Unauthorized', 403)

  return issue;
};

export const createIssue = async (data: {
  issue_title: string;
  issue_description: string;
  reserved_vehicle_id: string;
  issue_date?: Date;
}, user: AuthenticatedUser) => {

  const reserved_vehicle = await prisma.tbl_reserved_vehicles.findUnique({
    where: {
      reserved_vehicle_id: data.reserved_vehicle_id
    },
    include: {
      reservation: true
    }
  })

  if(!reserved_vehicle || reserved_vehicle.reservation.reservation_status !== 'APPROVED')
    throw new AppError('Reservation not found', 404)

  if(reserved_vehicle.reservation.user_id !== user.user_id)
    throw new AppError("Unauthorized, on this reservation", 403)

  return prisma.tbl_vehicle_issues.create({
    data,
    include: {
      reserved_vehicle: {
        include: {
          vehicle: true,
          reservation: true
        }
      }
    }
  });
};

export const updateIssue = async (
  id: string,
  data: Partial<{ issue_title?: string; issue_description?: string; issue_date?: Date }>,
  user: AuthenticatedUser
) => {
  const issue = await prisma.tbl_vehicle_issues.findFirst({
    where: {issue_id: id},
    include: {
      reserved_vehicle: {
        include: {
          reservation: true
        }
      }
    }
  });

  if(!issue || issue.issue_status !== 'OPEN')
    throw new AppError('Issue not found or closed', 404)

  if (issue.reserved_vehicle.reservation.user_id !== user.user_id)
    throw new AppError("You can't update this issue", 403)

  return prisma.tbl_vehicle_issues.update({
    where: { issue_id: id },
    data,
    include: {
      reserved_vehicle: {
        include: {
          reservation: true,
          vehicle: true
        }
      }
    }
  });
};

export const updateIssueMessage = async (issueId: string, message: string, user: AuthenticatedUser) => {
  // Check if issue exists and user has access
  const issue = await prisma.tbl_vehicle_issues.findUnique({
    where: { issue_id: issueId },
    include: {
      reserved_vehicle: {
        include: {
          vehicle: true,
          reservation: {
            include: {
              user: {
                include: {
                  auth: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!issue) {
    throw new AppError('Vehicle issue not found', 404);
  }

  // Check if user has access to this issue (same organization)
  if (issue.reserved_vehicle.vehicle.organization_id !== user.organization_id) {
    throw new AppError('Unauthorized access to this issue', 403);
  }

  // Update the issue with the new message
  const updatedIssue = await prisma.tbl_vehicle_issues.update({
    where: { issue_id: issueId },
    data: {
      message: message,
      updated_at: new Date(),
    },
    include: {
      reserved_vehicle: {
        include: {
          vehicle: true,
          reservation: {
            include: {
              user: {
                include: {
                  auth: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Notify the issue owner (reservation user) if it's not the same user
  const issueOwner = issue.reserved_vehicle.reservation.user;
  if (issueOwner && issueOwner.user_id !== user.user_id) {
    // Get the sender's full name
    const sender = await prisma.tbl_users.findUnique({
      where: { user_id: user.user_id },
      select: { first_name: true, last_name: true }
    });
    
    const senderName = sender ? `${sender.first_name} ${sender.last_name}` : 'Unknown User';
    // Send custom email notification
    if (issueOwner.auth?.email) {
      await sendVehicleIssueEmailNotification({
        user_id: issueOwner.user_id,
        to_email: issueOwner.auth.email,
        issue_title: issue.issue_title,
        message: message,
        sender_name: senderName,
        issue_id: issueId,
      });
    }
  }

  return updatedIssue;
};

export const deleteIssue = async (id: string) => {
  return prisma.tbl_vehicle_issues.delete({
    where: { issue_id: id },
  });
};
