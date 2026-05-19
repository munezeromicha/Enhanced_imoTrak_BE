import { PrismaClient, tbl_vehicle_issues, IssueSeverity, DriverStatus } from '@prisma/client';
import { AuthenticatedUser } from '../types/access';
import { AppError } from '../utils/Error';
import { createNotification, sendVehicleIssueEmailNotification } from './notification.service';
import { isVehicleAvailableForDateRange } from './reservation.services';

const prisma = new PrismaClient();

export const getAllIssues = async (user: AuthenticatedUser) => {
  const { organization_id } = user;
  const issues = await prisma.tbl_vehicle_issues.findMany({
    where: {
      reserved_vehicle: {
        vehicle: {
          organization_id: organization_id,
        },
      },
    },
    include: {
      reported_by_user: true,
      reported_by_driver: {
        include: {
          user: true,
        },
      },
      replacement_reserved_vehicle: {
        include: {
          vehicle: true,
        },
      },
      replies: {
        include: {
          user: true,
          driver: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          created_at: 'asc',
        },
      },
      reserved_vehicle: {
        include: {
          vehicle: true,
          drivers: {
            include: {
              driver: {
                include: {
                  user: true,
                },
              },
            },
          },
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
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
  return issues;
};

export const getIssueById = async (id: string, user: AuthenticatedUser) => {
  const issue = await prisma.tbl_vehicle_issues.findUnique({
    where: { issue_id: id },
    include: {
      reported_by_user: true,
      reported_by_driver: {
        include: {
          user: true,
        },
      },
      replacement_reserved_vehicle: {
        include: {
          vehicle: true,
        },
      },
      replies: {
        include: {
          user: true,
          driver: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          created_at: 'asc',
        },
      },
      reserved_vehicle: {
        include: {
          vehicle: true,
          drivers: {
            include: {
              driver: {
                include: {
                  user: true,
                },
              },
            },
          },
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
          },
        },
      },
    },
  });

  if (!issue) throw new AppError('No vehicle issue found', 404);

  if (issue.reserved_vehicle.vehicle.organization_id !== user.organization_id)
    throw new AppError('Unauthorized', 403);

  return issue;
};

export const createIssue = async (
  data: {
    issue_title: string;
    issue_description: string;
    reserved_vehicle_id: string;
    issue_date?: Date;
    severity_level?: IssueSeverity;
    replacement_requested?: boolean;
  },
  user: AuthenticatedUser
) => {
  const reserved_vehicle = await prisma.tbl_reserved_vehicles.findUnique({
    where: {
      reserved_vehicle_id: data.reserved_vehicle_id,
    },
    include: {
      reservation: true,
    },
  });

  if (!reserved_vehicle || (reserved_vehicle.reservation.reservation_status !== 'APPROVED' && reserved_vehicle.reservation.reservation_status !== 'IN_PROGRESS'))
    throw new AppError('Active Reservation not found', 404);

  // Authorization check: Is booking user OR active driver OR manager?
  const isActiveDriver = await prisma.tbl_reserved_vehicle_drivers.findFirst({
    where: {
      reserved_vehicle_id: data.reserved_vehicle_id,
      is_active: true,
      driver: {
        user_id: user.user_id,
      },
    },
  });

  if (reserved_vehicle.reservation.user_id !== user.user_id && !isActiveDriver) {
    if (!user.position_access?.vehicleIssues?.report) {
      throw new AppError('Unauthorized to report issue for this vehicle', 403);
    }
  }

  // Resolve reporter profiles
  const driverProfile = await prisma.tbl_drivers.findUnique({
    where: { user_id: user.user_id },
  });

  const reported_by_driver_id = driverProfile ? driverProfile.driver_id : null;
  const reported_by_user_id = driverProfile ? null : user.user_id;

  return prisma.tbl_vehicle_issues.create({
    data: {
      issue_title: data.issue_title,
      issue_description: data.issue_description,
      reserved_vehicle_id: data.reserved_vehicle_id,
      issue_date: data.issue_date || new Date(),
      reported_by_user_id,
      reported_by_driver_id,
      severity_level: data.severity_level || IssueSeverity.LOW,
      replacement_requested: data.replacement_requested || false,
      replacement_status: data.replacement_requested ? 'PENDING' : null,
    },
    include: {
      reported_by_user: true,
      reported_by_driver: {
        include: {
          user: true,
        },
      },
      reserved_vehicle: {
        include: {
          vehicle: true,
          reservation: true,
        },
      },
    },
  });
};

export const updateIssue = async (
  id: string,
  data: Partial<{ issue_title?: string; issue_description?: string; issue_date?: Date; severity_level?: IssueSeverity; replacement_requested?: boolean }>,
  user: AuthenticatedUser
) => {
  const issue = await prisma.tbl_vehicle_issues.findFirst({
    where: { issue_id: id },
    include: {
      reserved_vehicle: {
        include: {
          reservation: true,
        },
      },
    },
  });

  if (!issue || issue.issue_status !== 'OPEN')
    throw new AppError('Issue not found or closed', 404);

  // Check user authorization
  if (issue.reserved_vehicle.reservation.user_id !== user.user_id) {
    const driverProfile = await prisma.tbl_drivers.findUnique({
      where: { user_id: user.user_id },
    });
    if (!driverProfile || issue.reported_by_driver_id !== driverProfile.driver_id) {
      throw new AppError("You can't update this issue", 403);
    }
  }

  const updateData: any = { ...data };
  if (data.replacement_requested !== undefined) {
    updateData.replacement_status = data.replacement_requested ? 'PENDING' : null;
  }

  return prisma.tbl_vehicle_issues.update({
    where: { issue_id: id },
    data: updateData,
    include: {
      reserved_vehicle: {
        include: {
          reservation: true,
          vehicle: true,
        },
      },
    },
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

  if (issue.reserved_vehicle.vehicle.organization_id !== user.organization_id) {
    throw new AppError('Unauthorized access to this issue', 403);
  }

  // Update the issue with the new message
  const updatedIssue = await prisma.tbl_vehicle_issues.update({
    where: { issue_id: issueId },
    data: {
      message: message,
      updated_at: new Date(),
      issue_responder: user.user_id,
      issue_status: 'CLOSED',
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
    const sender = await prisma.tbl_users.findUnique({
      where: { user_id: user.user_id },
      select: { first_name: true, last_name: true },
    });
    
    const senderName = sender ? `${sender.first_name} ${sender.last_name}` : 'Unknown User';
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

export const addIssueReply = async (issueId: string, replyContent: string, user: AuthenticatedUser) => {
  const issue = await prisma.tbl_vehicle_issues.findUnique({
    where: { issue_id: issueId },
  });

  if (!issue) {
    throw new AppError('Issue not found', 404);
  }

  // Resolve sender profile: Driver or User
  const driverProfile = await prisma.tbl_drivers.findUnique({
    where: { user_id: user.user_id },
  });

  const driver_id = driverProfile ? driverProfile.driver_id : null;
  const user_id = driverProfile ? null : user.user_id;

  return prisma.tbl_vehicle_issue_replies.create({
    data: {
      issue_id: issueId,
      reply_content: replyContent,
      user_id,
      driver_id,
    },
    include: {
      user: true,
      driver: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const approveVehicleReplacement = async (
  issueId: string,
  replacementVehicleId: string,
  replacementDriverId: string,
  user: AuthenticatedUser
) => {
  const issue = await prisma.tbl_vehicle_issues.findUnique({
    where: { issue_id: issueId },
    include: {
      reserved_vehicle: {
        include: {
          vehicle: true,
          reservation: true,
        },
      },
    },
  });

  if (!issue) {
    throw new AppError('Vehicle issue not found', 404);
  }

  if (issue.issue_status === 'CLOSED') {
    throw new AppError('Cannot replace vehicle for a closed issue', 400);
  }

  const oldReservedVehicle = issue.reserved_vehicle;
  const reservation = oldReservedVehicle.reservation;

  // 1. Verify replacement vehicle exists and is available
  const replacementVehicle = await prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: replacementVehicleId },
  });
  if (!replacementVehicle) {
    throw new AppError('Replacement vehicle not found', 404);
  }

  const availabilityCheck = await isVehicleAvailableForDateRange(
    replacementVehicleId,
    reservation.departure_date,
    reservation.expected_returning_date,
    reservation.reservation_id
  );
  if (!availabilityCheck.available) {
    throw new AppError(`Replacement vehicle is not available: ${availabilityCheck.reason}`, 400);
  }

  // 2. Verify replacement driver exists and is AVAILABLE
  const replacementDriver = await prisma.tbl_drivers.findUnique({
    where: { driver_id: replacementDriverId },
  });
  if (!replacementDriver) {
    throw new AppError('Replacement driver not found', 404);
  }
  if (replacementDriver.driver_status !== DriverStatus.AVAILABLE) {
    throw new AppError('Selected replacement driver is not available', 400);
  }

  // 3. Perform replacement transaction
  return prisma.$transaction(async (tx) => {
    // 3a. Create new reserved vehicle
    const newReservedVehicle = await tx.tbl_reserved_vehicles.create({
      data: {
        vehicle_id: replacementVehicleId,
        reservation_id: reservation.reservation_id,
        starting_odometer: oldReservedVehicle.starting_odometer, // carry over
        fuel_provided: oldReservedVehicle.fuel_provided, // carry over
        returned_odometer: null,
      },
    });

    // 3b. Mark old reserved vehicle as replaced by the new one
    await tx.tbl_reserved_vehicles.update({
      where: { reserved_vehicle_id: oldReservedVehicle.reserved_vehicle_id },
      data: { replaced_by_id: newReservedVehicle.reserved_vehicle_id },
    });

    // 3c. Deactivate active assignments on the old reserved vehicle
    const activeAssignments = await tx.tbl_reserved_vehicle_drivers.findMany({
      where: {
        reserved_vehicle_id: oldReservedVehicle.reserved_vehicle_id,
        is_active: true,
      },
    });

    for (const assignment of activeAssignments) {
      await tx.tbl_reserved_vehicle_drivers.update({
        where: { assignment_id: assignment.assignment_id },
        data: {
          is_active: false,
          unassigned_at: new Date(),
        },
      });

      await tx.tbl_drivers.update({
        where: { driver_id: assignment.driver_id },
        data: { driver_status: DriverStatus.AVAILABLE },
      });
    }

    // 3d. Create new active assignment
    await tx.tbl_reserved_vehicle_drivers.create({
      data: {
        reserved_vehicle_id: newReservedVehicle.reserved_vehicle_id,
        driver_id: replacementDriverId,
        is_active: true,
      },
    });

    // 3e. Set new driver status to ON_TRIP
    await tx.tbl_drivers.update({
      where: { driver_id: replacementDriverId },
      data: { driver_status: DriverStatus.ON_TRIP },
    });

    // 3f. Update issue status
    const updatedIssue = await tx.tbl_vehicle_issues.update({
      where: { issue_id: issueId },
      data: {
        replacement_status: 'COMPLETED',
        replacement_reserved_vehicle_id: newReservedVehicle.reserved_vehicle_id,
        issue_status: 'CLOSED',
        message: `Vehicle replaced by vehicle ${replacementVehicle.plate_number}. Replacement driver assigned.`,
        updated_at: new Date(),
        issue_responder: user.user_id,
      },
    });

    // 3g. Create a system reply
    await tx.tbl_vehicle_issue_replies.create({
      data: {
        issue_id: issueId,
        reply_content: `[SYSTEM] Vehicle replacement approved. Old vehicle (${oldReservedVehicle.vehicle_id}) replaced by vehicle ${replacementVehicle.plate_number} with assigned driver.`,
        user_id: user.user_id,
      },
    });

    return updatedIssue;
  });
};
