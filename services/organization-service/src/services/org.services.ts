import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateOrganizationInput {
  organization_name: string;
  street_address: string;
  organization_phone: string;
  organization_email: string;
  organization_logo?: string;
  organization_customId: string;
}

export const createOrganization = async (data: CreateOrganizationInput) => {
  console.log(data);
  return await prisma.tbl_organizations.create({
    data: {
      ...data
    },
  });
};
