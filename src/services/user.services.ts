import { PrismaClient } from '@prisma/client';
import { sendUserCredentialsEmail } from '../utils/sendCredentials';
import { generateRandomPassword } from '../utils/password';
import argon2 from 'argon2';
import { AppError } from '../utils/Error';

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

    // Assign user to position
    await tx.tbl_position.update({
      where: { position_id },
      data: { user_id: user.user_id },
    });

    return user;
  });

  try {
    await sendUserCredentialsEmail(email, password);
  } catch (error) {
    console.error('Failed to send email:', error);
  }

  return result;
}


export const getUsersWithPositionsService = async (organization_id?: string) => {
  const users = await prisma.tbl_users.findMany({
    where: organization_id
      ? {
          positions: {
            some: {
              unit: {
                organization_id,
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
      positions: {
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
  });

  return users.map((user) => ({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.auth?.email,
    user_gender: user.user_gender,
    user_phone: user.user_phone,
    positions: user.positions.map((pos) => ({
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
      positions: {
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
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.auth?.email,
    user_gender: user.user_gender,
    user_phone: user.user_phone,
    positions: user.positions.map((pos) => ({
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
      auth: true,
      positions: {
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
  });

  if (!user) throw new AppError('User not found', 404);

  // If not global access, verify org
  if (!hasGlobalAccess) {
    const belongsToOrg = user.positions.some(
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
      positions: {
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
  });

  return {
    user_id: updated.user_id,
    first_name: updated.first_name,
    last_name: updated.last_name,
    email: updated.auth?.email,
    user_gender: updated.user_gender,
    user_phone: updated.user_phone,
    positions: updated.positions,
  };
};
