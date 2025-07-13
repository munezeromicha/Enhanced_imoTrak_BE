// auth.services.ts
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { AppError } from '../utils/Error';
import { signToken } from '../utils/jwt';

const prisma = new PrismaClient();

export async function loginUser(email: string, password: string) {
  // Find auth + user + positions + units + organizations
  const authWithUser = await prisma.tbl_auth.findUnique({
    where: { email },
    include: {
      user: {
        include: {
          positions: {
            include: {
              unit: {
                include: {
                  organization: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!authWithUser || !authWithUser.password) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const validPassword = await argon2.verify(authWithUser.password, password);
  if (!validPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!authWithUser.user) {
    throw new AppError('User profile not found', 500);
  }

  // Map positions info to response format
  const positionsData = authWithUser.user.positions.map((position) => ({
    position_id: position.position_id,
    position_name: position.position_name,
    unit_id: position.unit.unit_id,
    unit_name: position.unit.unit_name,
    organisation_id: position.unit.organization.organization_id,
    organization_name: position.unit.organization.organization_name,
  }));

  return positionsData
}

export async function loginWithPosition(email: string, password: string, position_id: string) {
  const auth = await prisma.tbl_auth.findUnique({
    where: { email },
    include: {
      user: {
      },
    },
  });

  if (!auth || !auth.password || !auth.user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (auth.user_status !== 'ACTIVE') {
    throw new AppError('User is not active', 403);
  }

  const isValid = await argon2.verify(auth.password, password);
  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

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

  if (!position) {
    throw new AppError('Position not found', 404);
  }

  if (position.user_id !== auth.user.user_id) {
    throw new AppError('Unauthorized: position does not belong to user', 403);
  }

  if (position.position_status !== 'ACTIVE') {
    throw new AppError('Position is not active', 403);
  }

  const token = signToken({
    user_id: auth.user.user_id,
    email: auth.email!,
    position_id,
  });

  const {unit, ...positionOut} = position

  return {
    token,
    organization: position.unit.organization,
    user: auth.user,
    position: positionOut,
    unit: position.unit,
  }
}
