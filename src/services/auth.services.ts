// auth.services.ts
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { AppError } from '../utils/Error';

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
