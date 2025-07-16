import { OrgStatus, PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';
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

interface CreateUnitPayload {
  unit_name: string;
  organization_id: string;
}

interface GetPositionsInUnitPayload {
  unit_id: string;
  requesterOrgId: string;
  hasOrgViewAccess: boolean;
}

interface GetOrgParams {
  organization_id: string;
  user: any;
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

export async function createUnitService(data: CreateUnitPayload) {
  const newUnit = await prisma.tbl_unit.create({
    data,
  });
  return newUnit;
}

export async function createPositionService(data: {
  position_name: string;
  position_description: string;
  unit_id: string;
  position_access: any;
}) {
  const position = await prisma.tbl_position.create({
    data,
  });
  return position;
}

export async function softDeletePositionService(positionId: string, userId: string, userAccess: any) {
  if (!userAccess?.positions?.delete) {
    throw new AppError('You do not have permission to delete positions', 403);
  }

  const position = await prisma.tbl_position.findUnique({
    where: { position_id: positionId },
    include: {
      unit: true,
    },
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }

  // Get the requesting user's organization
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: userId },
    include: {
      positions: {
        include: {
          unit: true,
        },
      },
    },
  });

  const userOrgId = user?.positions?.[0]?.unit?.organization_id;

  if (position.unit.organization_id !== userOrgId) {
    throw new AppError('You are not allowed to delete positions from another organization', 403);
  }

  if (position.position_status === 'INACTIVE') {
    throw new AppError('Position is already inactive', 400);
  }

  await prisma.tbl_position.update({
    where: { position_id: positionId },
    data: {
      position_status: 'INACTIVE',
    },
  });

  return { message: 'Position deleted (soft) successfully' };
}

export async function getPositionsInUnitService({
  unit_id,
  requesterOrgId,
  hasOrgViewAccess,
}: GetPositionsInUnitPayload) {
  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id: unit_id },
    include: { organization: true },
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }

  if (!hasOrgViewAccess && unit.organization_id !== requesterOrgId) {
    throw new AppError('Access denied: Unit is outside your organization', 403);
  }

  const positions = await prisma.tbl_position.findMany({
    where: { unit_id: unit_id },
    include: {
      user: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: { select: { email: true } },
        },
      },
    },
  });

  return positions;
}

export async function getUnitsService(organization_id: string) {
  const units = await prisma.tbl_unit.findMany({
    where: { organization_id },
    include: {
      positions: true,
    },
  });

  return units;
}

export const getSingleOrganizationService = async ({ organization_id, user }: GetOrgParams) => {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id }
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  return organization;
};
