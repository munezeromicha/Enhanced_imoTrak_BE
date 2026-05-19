import { PrismaClient, tbl_vehicle_issues, IssueSeverity, DriverStatus } from '@prisma/client';
import { AuthenticatedUser } from '../types/access';
import { AppError } from '../utils/Error';
import { createNotification, sendVehicleIssueEmailNotification } from './notification.service';
import { isVehicleAvailableForDateRange } from './reservation.services';
import { assertDriverNotOnAnotherVehicleInReservation } from '../utils/driverAssignment';

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
              reserved_vehicles: {
                include: {
                  vehicle: { include: { vehicle_model: true } },
                  drivers: {
                    where: { is_active: true },
                    include: {
                      driver: { include: { user: true } },
                    },
                  },
                  replaced_by: {
                    include: {
                      vehicle: { include: { vehicle_model: true } },
                    },
                  },
                },
                orderBy: { created_at: 'asc' },
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

  const updatedIssue = await prisma.tbl_vehicle_issues.update({
    where: { issue_id: issueId },
    data: {
      message: message,
      updated_at: new Date(),
      issue_responder: user.user_id,
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

export const closeIssueByUser = async (
  issueId: string,
  user: AuthenticatedUser,
  closingNote?: string
) => {
  const issue = await prisma.tbl_vehicle_issues.findUnique({
    where: { issue_id: issueId },
    include: {
      reported_by_driver: true,
      reserved_vehicle: {
        include: { vehicle: true },
      },
    },
  });

  if (!issue) {
    throw new AppError('Vehicle issue not found', 404);
  }

  if (issue.issue_status === 'CLOSED') {
    throw new AppError('Issue is already closed', 400);
  }

  if (issue.reserved_vehicle.vehicle.organization_id !== user.organization_id) {
    throw new AppError('Unauthorized access to this issue', 403);
  }

  const isReporter =
    issue.reported_by_user_id === user.user_id ||
    issue.reported_by_driver?.user_id === user.user_id;
  const isStaff = !!user.position_access?.vehicleIssues?.update;

  if (!isReporter && !isStaff) {
    throw new AppError(
      'Only the issue reporter or authorized staff can close this issue',
      403
    );
  }

  const updatedIssue = await prisma.tbl_vehicle_issues.update({
    where: { issue_id: issueId },
    data: {
      issue_status: 'CLOSED',
      updated_at: new Date(),
      ...(closingNote ? { message: closingNote } : {}),
    },
    include: {
      reserved_vehicle: {
        include: {
          vehicle: true,
          reservation: {
            include: {
              reserved_vehicles: {
                include: {
                  vehicle: { include: { vehicle_model: true } },
                  drivers: {
                    where: { is_active: true },
                    include: { driver: { include: { user: true } } },
                  },
                },
              },
            },
          },
        },
      },
      replies: { orderBy: { created_at: 'asc' } },
      replacement_reserved_vehicle: { include: { vehicle: true } },
    },
  });

  if (closingNote?.trim()) {
    await prisma.tbl_vehicle_issue_replies.create({
      data: {
        issue_id: issueId,
        reply_content: `[ISSUE_CLOSED]\n${closingNote.trim()}`,
        user_id: user.user_id,
      },
    });
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

async function resolveIssueReporterUserId(issue: {
  reported_by_user_id: string | null;
  reported_by_driver_id: string | null;
  reserved_vehicle: {
    reservation: { user_id: string };
  };
}): Promise<string> {
  if (issue.reported_by_user_id) return issue.reported_by_user_id;
  if (issue.reported_by_driver_id) {
    const driver = await prisma.tbl_drivers.findUnique({
      where: { driver_id: issue.reported_by_driver_id },
      select: { user_id: true },
    });
    if (driver?.user_id) return driver.user_id;
  }
  return issue.reserved_vehicle.reservation.user_id;
}

function formatReplacementDetailsMessage(params: {
  staffMessage?: string;
  replacementVehicle: {
    plate_number: string;
    energy_type: string;
    vehicle_year: number;
    vehicle_model?: { vehicle_model_name: string } | null;
  };
  replacementDriver: {
    license_number: string;
    license_category: string;
    experience_years: number;
    driver_status: string;
    user: { first_name: string; last_name: string; user_phone: string };
  };
  oldPlate: string;
}): string {
  const { replacementVehicle: v, replacementDriver: d, oldPlate, staffMessage } = params;
  const driverName = `${d.user.first_name} ${d.user.last_name}`.trim();
  const modelName = v.vehicle_model?.vehicle_model_name ?? 'N/A';

  const lines = [
    'Your vehicle issue has been addressed with a new assignment for this trip.',
    '',
    staffMessage ? `Message from reviewer:\n${staffMessage}\n` : '',
    '--- Replacement vehicle ---',
    `Plate: ${v.plate_number}`,
    `Model: ${modelName}`,
    `Year: ${v.vehicle_year}`,
    `Energy: ${v.energy_type}`,
    '',
    '--- Replacement driver ---',
    `Name: ${driverName}`,
    `Phone: ${d.user.user_phone}`,
    `License: ${d.license_number}`,
    `Category: ${d.license_category}`,
    `Experience: ${d.experience_years} year(s)`,
    `Status: ${d.driver_status}`,
    '',
    `Previous vehicle on this trip: ${oldPlate}`,
  ].filter(Boolean);

  return lines.join('\n');
}

export const approveVehicleReplacement = async (
  issueId: string,
  replacementVehicleId: string,
  replacementDriverId: string,
  user: AuthenticatedUser,
  staffMessage?: string
) => {
  const issue = await prisma.tbl_vehicle_issues.findUnique({
    where: { issue_id: issueId },
    include: {
      reported_by_user: { include: { auth: true } },
      reported_by_driver: {
        include: {
          user: { include: { auth: true } },
        },
      },
      reserved_vehicle: {
        include: {
          vehicle: true,
          reservation: {
            include: {
              user: { include: { auth: true } },
            },
          },
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

  const replacementVehicle = await prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: replacementVehicleId },
    include: { vehicle_model: true },
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

  const replacementDriver = await prisma.tbl_drivers.findUnique({
    where: { driver_id: replacementDriverId },
    include: {
      user: true,
    },
  });
  if (!replacementDriver) {
    throw new AppError('Replacement driver not found', 404);
  }
  if (replacementDriver.driver_status !== DriverStatus.AVAILABLE) {
    throw new AppError('Selected replacement driver is not available', 400);
  }

  await assertDriverNotOnAnotherVehicleInReservation(
    prisma,
    reservation.reservation_id,
    replacementDriverId
  );

  const reporterUserId = await resolveIssueReporterUserId(issue);

  const detailedMessage = formatReplacementDetailsMessage({
    staffMessage,
    replacementVehicle,
    replacementDriver,
    oldPlate: oldReservedVehicle.vehicle.plate_number,
  });

  const staff = await prisma.tbl_users.findUnique({
    where: { user_id: user.user_id },
    select: { first_name: true, last_name: true },
  });
  const staffName = staff
    ? `${staff.first_name} ${staff.last_name}`.trim()
    : 'Fleet staff';

  const assignmentLog = `[ASSIGNMENT_LOG]
Action: ADDITIONAL_VEHICLE_ASSIGNED
Timestamp: ${new Date().toISOString()}
Assigned by: ${staffName}
Issue vehicle (reported): ${oldReservedVehicle.vehicle.plate_number}
New vehicle: ${replacementVehicle.plate_number} (${replacementVehicle.vehicle_model?.vehicle_model_name ?? 'N/A'})
New driver: ${replacementDriver.user.first_name} ${replacementDriver.user.last_name}
Driver phone: ${replacementDriver.user.user_phone}
License: ${replacementDriver.license_number} (${replacementDriver.license_category})
Reservation: ${reservation.reservation_id}
Note: Original reservation assignments are unchanged. This issue remains OPEN until the reporter closes it.

${detailedMessage}`;

  const result = await prisma.$transaction(
    async (tx) => {
      const newReservedVehicle = await tx.tbl_reserved_vehicles.create({
        data: {
          vehicle_id: replacementVehicleId,
          reservation_id: reservation.reservation_id,
          starting_odometer: oldReservedVehicle.starting_odometer,
          fuel_provided: oldReservedVehicle.fuel_provided,
          returned_odometer: null,
        },
      });

      await assertDriverNotOnAnotherVehicleInReservation(
        tx,
        reservation.reservation_id,
        replacementDriverId,
        { excludeReservedVehicleId: newReservedVehicle.reserved_vehicle_id }
      );

      await tx.tbl_reserved_vehicle_drivers.create({
        data: {
          reserved_vehicle_id: newReservedVehicle.reserved_vehicle_id,
          driver_id: replacementDriverId,
          is_active: true,
        },
      });

      await tx.tbl_drivers.update({
        where: { driver_id: replacementDriverId },
        data: { driver_status: DriverStatus.ON_TRIP },
      });

      const updatedIssue = await tx.tbl_vehicle_issues.update({
        where: { issue_id: issueId },
        data: {
          replacement_status: 'ASSIGNED',
          replacement_reserved_vehicle_id: newReservedVehicle.reserved_vehicle_id,
          issue_status: 'OPEN',
          updated_at: new Date(),
          issue_responder: user.user_id,
        },
      });

      return { updatedIssue, newReservedVehicle };
    },
    { maxWait: 15000, timeout: 30000 }
  );

  await prisma.tbl_vehicle_issue_replies.create({
    data: {
      issue_id: issueId,
      reply_content: assignmentLog,
      user_id: user.user_id,
    },
  });

  const reporter = await prisma.tbl_users.findUnique({
    where: { user_id: reporterUserId },
    include: { auth: true },
  });

  if (reporter && reporter.user_id !== user.user_id) {
    const sender = await prisma.tbl_users.findUnique({
      where: { user_id: user.user_id },
      select: { first_name: true, last_name: true },
    });
    const senderName = sender
      ? `${sender.first_name} ${sender.last_name}`
      : 'Fleet staff';

    if (reporter.auth?.email) {
      await sendVehicleIssueEmailNotification({
        user_id: reporter.user_id,
        to_email: reporter.auth.email,
        issue_title: issue.issue_title,
        message: `${detailedMessage}\n\nThis issue remains OPEN. You may report follow-up problems or close the issue when resolved.`,
        sender_name: senderName,
        issue_id: issueId,
      });
    }
  }

  return getIssueById(issueId, user);
};
