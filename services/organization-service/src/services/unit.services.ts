import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface CreateUnitInput {
  unit_name: string;
  organization_id: string;
}

export const createUnit = async (data: CreateUnitInput) => {
  return await prisma.tbl_unit.create({
    data,
  });
};
