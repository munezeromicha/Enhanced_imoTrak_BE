import { PrismaClient } from '@prisma/client';
import { sendInvitationEmail } from '../utils/sendCredentials';
import { generateRandomPassword } from '../utils/password';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppError } from '../utils/Error';
import {
  createUserPositionAssignment,
  mapAssignmentsToPositions,
  userPositionAssignmentsInclude,
} from '../utils/userPositions';

dotenv.config();

const prisma = new PrismaClient();

interface CreateUserPayload {
  first_name: string;
  last_name: string;
  user_nid: string;
  user_phone: string;
  user_gender: 'MALE' | 'FEMALE';
  user_dob: Date;
  street_address?: string;
  position_id: string;
  email: string;
  requester_org_id: string;
  hasOrgCreateAccess: boolean;
}

export async function createUserService(data: CreateUserPayload) {
  const {
    first_name,
    last_name,
    user_nid,
    user_phone,
    user_gender,
    user_dob,
    street_address,
    position_id,
    email,
    requester_org_id,
    hasOrgCreateAccess,
  } = data;

  // Step 1: Validate position
  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!position || position.position_status !== 'ACTIVE') {
    throw new Error('Position not found or inactive');
  }

  if (!hasOrgCreateAccess) {
    if (position.unit.organization.organization_id !== requester_org_id) {
      throw new Error('Position does not belong to your organization');
    }
  }

  const password = generateRandomPassword(10);
  const hashedPassword = await argon2.hash(password);

  const result = await prisma.$transaction(async (tx) => {
    const auth = await tx.tbl_auth.create({
      data: {
        email,
        password: hashedPassword,
        user_status: 'ACTIVE',
      },
    });

    // Create user record
    const user = await tx.tbl_users.create({
      data: {
        first_name,
        last_name,
        user_nid,
        user_phone,
        user_gender,
        user_dob: new Date(user_dob),
        street_address,
        auth_id: auth.auth_id,
      },
    });

    // Assign user to position (multiple users can share the same position)
    await createUserPositionAssignment(tx, user.user_id, position_id);

    return {
      user,
      position: position.position_name,
      unit: position.unit.unit_name,
      organization: position.unit.organization.organization_name,
    };
  });

  try {
    const jwtSecret = process.env.JWT_SECRET as string
    const expiresIn = (process.env.VERIFY_LINK_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'];
    if (!jwtSecret) {
      throw new Error('JWT secret is not defined');
    }
    await sendInvitationEmail(email, jwt.sign({email}, jwtSecret, {expiresIn}), result.position, result.unit, result.organization);
  } catch (error) {
    console.error('Failed to send email:', error);
  }

  return result.user;
}

export const getUsersWithPositionsService = async (organization_id?: string) => {
  const users = await prisma.tbl_users.findMany({
    where: organization_id
      ? {
          position_assignments: {
            some: {
              position: {
                unit: {
                  organization_id,
                },
              },
            },
          },
        }
      : undefined,
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      user_gender: true,
      user_phone: true,
      auth: {
        select: {
          email: true,
        },
      },
      position_assignments: {
        select: {
          position: {
            select: {
              position_id: true,
              position_name: true,
              position_description: true,
              position_status: true,
              unit: {
                select: {
                  unit_id: true,
                  unit_name: true,
                  organization: {
                    select: {
                      organization_id: true,
                      organization_name: true,
                      organization_email: true,
                      organization_phone: true,
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

  return users.map((user) => ({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.auth?.email,
    user_gender: user.user_gender,
    user_phone: user.user_phone,
    positions: user.position_assignments.map((a) => a.position).map((pos) => ({
      position_id: pos.position_id,
      position_name: pos.position_name,
      position_description: pos.position_description,
      position_status: pos.position_status,
      unit: {
        unit_id: pos.unit.unit_id,
        unit_name: pos.unit.unit_name,
        organization: pos.unit.organization,
      },
    })),
  }));
};

export const getSingleUserWithPositionsService = async (user_id: string) => {
  const user = await prisma.tbl_users.findUnique({
    where: { user_id },
    include: {
      auth: {
        select: {
          email: true,
        },
      },
      ...userPositionAssignmentsInclude,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const { auth, position_assignments, ...rest } = user;

  return {
    email: auth.email,
    ...rest,
    positions: mapAssignmentsToPositions(user),
  };
};

export const updateUserService = async (
  user_id: string,
  data: Partial<Omit<CreateUserPayload, 'position_id' | 'email' | 'requester_org_id' | 'hasOrgCreateAccess'>>,
  requester_org_id: string,
  hasGlobalAccess: boolean
) => {
  const user = await prisma.tbl_users.findUnique({
    where: { user_id },
    include: {
      auth: {
        select: {
          email: true
        }
      },
      ...userPositionAssignmentsInclude,
    },
  });


  if (!user) throw new AppError('User not found', 404);

  const userPositions = mapAssignmentsToPositions(user);

  // If not global access, verify org
  if (!hasGlobalAccess) {
    const belongsToOrg = userPositions.some(
      (pos) => pos.unit.organization.organization_id === requester_org_id
    );
    if (!belongsToOrg) {
      throw new AppError('You do not have permission to update this user', 403);
    }
  }

  const updated = await prisma.tbl_users.update({
    where: { user_id },
    data,
    include: {
      auth: true,
      ...userPositionAssignmentsInclude,
    },
  });

  return {
    user_id: updated.user_id,
    first_name: updated.first_name,
    last_name: updated.last_name,
    email: updated.auth?.email,
    user_gender: updated.user_gender,
    user_phone: updated.user_phone,
    positions: mapAssignmentsToPositions(updated),
  };
};

export const getUnverifiedUsersService = async (organization_id: string) => {
  return await prisma.tbl_users.findMany({
    where: {
      auth: {
        is_verified: false,
      },
      position_assignments: {
        some: {
          position: {
            unit: {
              organization_id,
            },
          },
        },
      },
    },
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      user_gender: true,
      user_phone: true,
      auth: {
        select: {
          email: true,
          is_verified: true,
        },
      },
      position_assignments: {
        select: {
          position: {
            select: {
              position_id: true,
              position_name: true,
              position_description: true,
              position_status: true,
              unit: {
                select: {
                  unit_id: true,
                  unit_name: true,
                  organization: {
                    select: {
                      organization_id: true,
                      organization_name: true,
                      organization_email: true,
                      organization_phone: true,
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
};

export const getSingleUnverifiedUserService = async (
  organization_id: string,
  user_id: string
) => {
  return await prisma.tbl_users.findFirst({
    where: {
      user_id,
      auth: {
        is_verified: false,
      },
      position_assignments: {
        some: {
          position: {
            unit: {
              organization_id,
            },
          },
        },
      },
    },
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      user_gender: true,
      user_phone: true,
      auth: {
        select: {
          email: true,
          is_verified: true,
        },
      },
      position_assignments: {
        select: {
          position: {
            select: {
              position_id: true,
              position_name: true,
              position_description: true,
              position_status: true,
              unit: {
                select: {
                  unit_id: true,
                  unit_name: true,
                  organization: {
                    select: {
                      organization_id: true,
                      organization_name: true,
                      organization_email: true,
                      organization_phone: true,
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
};

export const updateMyProfileService = async (
  user_id: string,
  data: {
    first_name?: string;
    last_name?: string;
    user_phone?: string;
    user_gender?: 'MALE' | 'FEMALE';
    user_dob?: Date;
    street_address?: string | null;
    user_nid?: string;
    user_photo?: string | null;
  }
) => {
  const updated = await prisma.tbl_users.update({
    where: { user_id },
    data,
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      user_nid: true,
      user_phone: true,
      user_gender: true,
      user_dob: true,
      user_photo: true,
      street_address: true,
      auth: {
        select: {
          email: true,
        },
      },
    },
  });

  return {
    user_id: updated.user_id,
    first_name: updated.first_name,
    last_name: updated.last_name,
    email: updated.auth?.email,
    user_nid: updated.user_nid,
    user_phone: updated.user_phone,
    user_gender: updated.user_gender,
    user_dob: updated.user_dob,
    user_photo: updated.user_photo,
    street_address: updated.street_address,
  };
};

/**
 * Permanently removes a user and dependent rows. Intended for hub SuperAdmin
 * (position_access.organizations.create + users.delete).
 *
 * Clears nullable FKs pointing at the user, deletes reservations they own (and
 * related reserved vehicles, issues, locations), then audit logs, notifications,
 * JWT blacklist, the user row, and auth row — all in one transaction.
 */
export async function deleteUserPermanentlyService(params: {
  targetUserId: string;
  actorUserId: string;
}) {
  const { targetUserId, actorUserId } = params;

  if (targetUserId === actorUserId) {
    throw new AppError('You cannot delete your own account', 400);
  }

  const existing = await prisma.tbl_users.findUnique({
    where: { user_id: targetUserId },
    select: { user_id: true, auth_id: true },
  });

  if (!existing) {
    throw new AppError('User not found', 404);
  }

  // Pre-compute IDs OUTSIDE the transaction so the transaction itself stays
  // short. A new reservation racing in here would still be deleted by the
  // post-transaction cleanup below, so the user row never has dangling FKs.
  const ownedReservationsPre = await prisma.tbl_reservations.findMany({
    where: { user_id: targetUserId },
    select: { reservation_id: true },
  });
  const reservationIds = ownedReservationsPre.map((r) => r.reservation_id);

  const reservedRowsPre = reservationIds.length
    ? await prisma.tbl_reserved_vehicles.findMany({
        where: { reservation_id: { in: reservationIds } },
        select: { reserved_vehicle_id: true },
      })
    : [];
  const reservedIds = reservedRowsPre.map((r) => r.reserved_vehicle_id);

  await prisma.$transaction(
    async (tx) => {
      // 1) Null out all nullable FKs pointing at this user. These are all
      //    independent of each other so we can fire them in parallel.
      await Promise.all([
        tx.tbl_user_position_assignments.deleteMany({
          where: { user_id: targetUserId },
        }),
        tx.tbl_reservations.updateMany({
          where: { approved_by: targetUserId },
          data: { approved_by: null },
        }),
        tx.tbl_reservations.updateMany({
          where: { canceled_by: targetUserId },
          data: { canceled_by: null },
        }),
        tx.tbl_reservations.updateMany({
          where: { completed_by: targetUserId },
          data: { completed_by: null },
        }),
        tx.tbl_reservations.updateMany({
          where: { reviewed_by: targetUserId },
          data: { reviewed_by: null },
        }),
        tx.tbl_reserved_vehicles.updateMany({
          where: { returned_by: targetUserId },
          data: { returned_by: null },
        }),
        tx.tbl_vehicle_issues.updateMany({
          where: { issue_responder: targetUserId },
          data: { issue_responder: null },
        }),
        tx.tbl_users.updateMany({
          where: { updated_by_user_id: targetUserId },
          data: { updated_by_user_id: null },
        }),
      ]);

      // 2) Delete dependents of the user's reservations (issues + locations
      //    on their reserved vehicles), again in parallel because they touch
      //    different tables.
      if (reservedIds.length > 0) {
        await Promise.all([
          tx.tbl_vehicle_issues.deleteMany({
            where: { reserved_vehicle_id: { in: reservedIds } },
          }),
          tx.tbl_vehicle_locations.deleteMany({
            where: { reserved_vehicle_id: { in: reservedIds } },
          }),
        ]);
      }

      // 3) Reserved vehicles, then reservations (FK order matters here).
      if (reservationIds.length > 0) {
        await tx.tbl_reserved_vehicles.deleteMany({
          where: { reservation_id: { in: reservationIds } },
        });
        await tx.tbl_reservations.deleteMany({
          where: { user_id: targetUserId },
        });
      }

      // 4) Logs / notifications / sessions in parallel.
      await Promise.all([
        tx.tbl_audit_logs.deleteMany({ where: { user_id: targetUserId } }),
        tx.tbl_notifications.deleteMany({ where: { user_id: targetUserId } }),
        tx.tbl_jwt_blacklist.deleteMany({ where: { user_id: targetUserId } }),
      ]);

      // 5) Finally the user itself, then their auth row (FK from user→auth).
      await tx.tbl_users.delete({ where: { user_id: targetUserId } });
      await tx.tbl_auth.delete({ where: { auth_id: existing.auth_id } });
    },
    {
      // Generous timeouts: this runs on a remote DB (Neon) where each
      // round-trip can be ~300ms, and admin user-deletes are rare.
      maxWait: 10_000,
      timeout: 30_000,
    },
  );
}

