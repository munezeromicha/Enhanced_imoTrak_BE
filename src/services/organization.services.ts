import { OrgStatus, PrismaClient, tbl_organizations } from '@prisma/client';
import { AppError } from '../utils/Error';
import { AuthenticatedUser } from '../types/access';
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

interface GetUnitParams {
  unit_id: string;
  user: AuthenticatedUser;
}

interface UpdateUnitParams {
  unit_id: string;
  user: AuthenticatedUser;
  data: {
    unit_name: string;
  };
}

interface DeleteUnitParams {
  unit_id: string;
  user: AuthenticatedUser;
}

interface GetSinglePositionParams {
  position_id: string;
  user: AuthenticatedUser;
}

interface UpdatePositionParams {
  position_id: string;
  updateData: {
    position_name?: string;
    position_description?: string;
    position_access?: object;
  };
  user: AuthenticatedUser;
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

export async function getUnitsService(organization_id?: string) {
  const units = await prisma.tbl_unit.findMany({
    where: organization_id ? { organization_id } : undefined,
    include: {
      positions: true,
    },
  });
  return units;
}

export const getSingleOrganizationService = async ({ organization_id, user }: GetOrgParams) => {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id },
    include: {
      units: true
    }
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  return organization;
};

export const updateOrganizationService = async ({
  organization_id,
  updates
}: {
  organization_id: string;
  updates: Partial<tbl_organizations>;
}) => {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id }
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  // Ensure status is not updated
  if ('status' in updates) {
    delete updates.status;
  }

  const updatedOrg = await prisma.tbl_organizations.update({
    where: { organization_id },
    data: updates
  });

  return updatedOrg;
};

export const deleteOrganizationService = async ({
  organization_id,
}: {
  organization_id: string;
}) => {
  const organization = await prisma.tbl_organizations.findUnique({
    where: { organization_id }
  });

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  // Get all unit_ids for the organization
  const units = await prisma.tbl_unit.findMany({
    where: { organization_id },
    select: { unit_id: true }
  });
  const unitIds = units.map((unit) => unit.unit_id);

  // Perform soft delete in a transaction
  await prisma.$transaction([
    prisma.tbl_organizations.update({
      where: { organization_id },
      data: { organization_status: 'INACTIVE' }
    }),
    prisma.tbl_unit.updateMany({
      where: { organization_id },
      data: { status: 'INACTIVE' }
    }),
    prisma.tbl_position.updateMany({
      where: { unit_id: { in: unitIds } },
      data: { position_status: 'INACTIVE' }
    })
  ]);
};

export const getSingleUnitService = async ({ unit_id, user }: GetUnitParams) => {
  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
    include: {
      positions: true
    }
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }
  const isOwnOrg = unit.organization_id === user.organization_id;
  const isSuperUser = user.position_access?.organizations.create;
  if (!isOwnOrg && !isSuperUser) {
    throw new AppError('You do not have permission to access this unit', 403);
  }

  return unit;
};

export const updateUnitService = async ({ unit_id, user, data }: UpdateUnitParams) => {
  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }

  const userOrgId = user.organization_id;

  if (!userOrgId || unit.organization_id !== userOrgId && !user.position_access?.organizations.create) {
    throw new AppError('You can only update units within your organization', 403);
  }

  const updatedUnit = await prisma.tbl_unit.update({
    where: { unit_id },
    data: {
      unit_name: data.unit_name,
    },
  });

  return updatedUnit;
};

export const deleteUnitService = async ({ unit_id, user }: DeleteUnitParams) => {
  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id },
    include: { organization: true }
  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }

  const userOrgId = user.organization_id;

  if (!user.position_access.organizations?.create && unit.organization_id !== userOrgId) {
    throw new AppError('You can only delete units within your organization', 403);
  }

  // Fetch positions under this unit
  const positions = await prisma.tbl_position.findMany({
    where: { unit_id }
  });

  const positionIds = positions.map(pos => pos.position_id);

  await prisma.$transaction([
    prisma.tbl_unit.update({
      where: { unit_id },
      data: { status: 'INACTIVE' }
    }),
    prisma.tbl_position.updateMany({
      where: { unit_id },
      data: { position_status: 'INACTIVE' }
    })
  ]);
};

export const getSinglePositionService = async ({ position_id, user }: GetSinglePositionParams) => {
  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: {
        select: {
          organization_id: true
        }
      }
    }
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }

  const positionOrgId = position.unit.organization_id;

  // If user has no global org access, restrict to same org
  if (user.organization_id !== positionOrgId && !user.position_access?.organizations.create) {
    throw new AppError('You do not have permission to view this position', 403);
  }

  return position;
};

export const updatePositionService = async ({
  position_id,
  updateData,
  user
}: UpdatePositionParams) => {
  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: true
    }
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }

  if (position.unit.organization_id !== user.organization_id && !user.position_access?.organizations.create) {
    throw new AppError('You can only update positions within your organization', 403);
  }

  const updatedPosition = await prisma.tbl_position.update({
    where: { position_id },
    data: updateData
  });

  return updatedPosition;
};

export async function getPositionsService(organization_id?: string) {
  const positions = await prisma.tbl_position.findMany({
    where: organization_id
      ? {
          unit: {
            organization_id: organization_id,
          },
        }
      : undefined,
    include: {
      unit: {
        include: {
          organization: true,
        },
      },
    },
  });

  return positions;
}

