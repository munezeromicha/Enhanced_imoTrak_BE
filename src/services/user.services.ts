import { PrismaClient } from '@prisma/client';
import { sendUserCredentialsEmail } from '../utils/sendCredentials';
import { generateRandomPassword } from '../utils/password';
import argon2 from 'argon2';

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

  // Step 2: Run all write operations inside a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create auth record
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

export const getUsersGroupedByUnitsService = async (organization_id: string) => {
  const units = await prisma.tbl_unit.findMany({
    where: { organization_id },
    select: {
      unit_id: true,
      unit_name: true,
      positions: {
        where: {
          user_id: {
            not: null,
          },
        },
        select: {
          position_id: true,
          position_name: true,
          user: {
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
            },
          },
        },
      },
    },
  });

  return units.map((unit) => ({
    unit_id: unit.unit_id,
    unit_name: unit.unit_name,
    users: unit.positions.map((pos) => ({
      user_id: pos.user?.user_id,
      first_name: pos.user?.first_name,
      last_name: pos.user?.last_name,
      email: pos.user?.auth.email,
      user_gender: pos.user?.user_gender,
      user_phone: pos.user?.user_phone,
      position_id: pos.position_id,
      position_name: pos.position_name,
    })),
  }));
};
