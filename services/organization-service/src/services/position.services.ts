import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface CreatePositionInput {
  position_name?: string;
  position_description?: string;
  position_access: object;
  unit_id: string;
}

export const createPosition = async (data: CreatePositionInput) => {
  return await prisma.tbl_position.create({
    data,
  });
};
