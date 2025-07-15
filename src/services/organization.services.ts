import { OrgStatus, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface CreateOrgPayload {
  organization_name: string;
  organization_email: string;
  organization_phone: string;
  organization_customId: string;
  organization_logo: string;
  street_address: string;
}

interface GetOrganizationsOptions {
  page?: number;
  limit?: number;
  status?: OrgStatus;
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

export async function getOrganizationsService({ page = 1, limit = 10, status }: GetOrganizationsOptions) {
  const whereClause = status ? { organization_status: status } : {};

  const [organizations, total] = await Promise.all([
    prisma.tbl_organizations.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' }
    }),
    prisma.tbl_organizations.count({ where: whereClause })
  ]);

  return {
    organizations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  };
}
