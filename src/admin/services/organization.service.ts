import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

let counter = 1;

function generateCustomId(prefix = 'UN') {
  const padded = String(counter).padStart(3, '0');
  counter++;
  return `${prefix}-${padded}`;
}

export const createOrganization = async (data: {
  name: string;
  address: string;
  phone: string;
  email: string;
}) => {
  const customId = generateCustomId();
  return await prisma.organizations.create({
    data: {
      ...data,
      customId,
      status: 'Active',
    },
  });
};

export const getAllOrganizations = async () => {
  return await prisma.organizations.findMany();
};

export const getOrganizationById = async (id: string) => {
  return await prisma.organizations.findUnique({ where: { id } });
};

export const updateOrganization = async (
  id: string,
  data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    status?: string;
  }
) => {
  return await prisma.organizations.update({
    where: { id },
    data,
  });
};

export const deleteOrganization = async (id: string) => {
  return await prisma.organizations.delete({
    where: { id },
  });
};
