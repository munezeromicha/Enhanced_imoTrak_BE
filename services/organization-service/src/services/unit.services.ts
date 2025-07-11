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

export const getAllUnits = async () => {
  return await prisma.tbl_unit.findMany({
    include: {
      tbl_organizations: true, // Optional: include related organization
    },
  });
};

export const getUnitsByOrganization = async (organization_id: string) => {
  return await prisma.tbl_unit.findMany({
    where: { organization_id },
    include: {
      tbl_organizations: true, // Optional
    },
  });
};