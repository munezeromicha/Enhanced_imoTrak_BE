import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface CreateOrgPayload {
  organization_name: string;
  organization_email: string;
  organization_phone: string;
  organization_customId: string;
  organization_logo: string;
  street_address: string;
}

export async function createOrganizationService(data: CreateOrgPayload) {
  const newOrg = await prisma.tbl_organizations.create({
    data: {
      ...data,
      organization_status: 'ACTIVE',
    }
  });

  return newOrg;
}
