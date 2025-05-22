import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrganization = async (data: {
  name: string;
  address: string;
  phone: string;
  email: string;
}) => {
  return await prisma.organizations.create({
    data,
  });
};
