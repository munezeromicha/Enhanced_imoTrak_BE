import { OrgStatus, Prisma, PrismaClient, tbl_organizations } from '@prisma/client';
import { AppError } from '../utils/Error';
import {
  createUserPositionAssignment,
  enrichPositionResponse,
  mapAssignmentsToPositions,
  positionAssignmentsInclude,
  userHasPositionAssignment,
  userPositionAssignmentsInclude,
} from '../utils/userPositions';
import { AuthenticatedUser, position_accesses } from '../types/access';
import { clampPositionAccess, isPositionAccessSubset } from '../utils/positionAccessUtils';
import { INUMA_APPROVER_IMOTRAK_POSITION, normalizeCatalogName } from '../constants/inuma';
const prisma = new PrismaClient();

interface CreateOrgPayload {
  organization_name: string;
  organization_email: string;
  organization_phone: string;
  organization_customId: string;
  organization_logo: string;
  street_address: string;
  uses_reservations?: boolean;
  leader_unit_name?: string;
  leader_position_name?: string;
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
    position_access?: any;
  };
  user: AuthenticatedUser;
}

interface AssignUserToPositionParams {
  position_id: string;
  user_email: string;
  user: AuthenticatedUser;
}

export async function createOrganizationService(data: CreateOrgPayload) {
  const usesReservations = data.uses_reservations ?? true;
  const leaderUnitName = data.leader_unit_name?.trim() || 'Headquarters';
  const leaderPositionName = data.leader_position_name?.trim() || 'Organization Leader';

  const leaderAccess = buildLeaderPositionAccess(usesReservations);

  const result = await prisma.$transaction(async (tx) => {
    const newOrg = await tx.tbl_organizations.create({
      data: {
        organization_name: data.organization_name,
        organization_email: data.organization_email,
        organization_phone: data.organization_phone,
        organization_customId: data.organization_customId,
        organization_logo: data.organization_logo,
        street_address: data.street_address,
        organization_status: 'ACTIVE',
        uses_reservations: usesReservations,
      },
    });

    const leaderUnit = await tx.tbl_unit.create({
      data: {
        unit_name: leaderUnitName,
        organization_id: newOrg.organization_id,
        is_primary: true,
        status: 'ACTIVE',
      },
    });

    const leaderPosition = await tx.tbl_position.create({
      data: {
        position_name: leaderPositionName,
        position_description: 'Primary organization leader with elevated access',
        unit_id: leaderUnit.unit_id,
        is_org_leader: true,
        position_access: leaderAccess as unknown as Prisma.InputJsonValue,
        position_status: 'ACTIVE',
      },
    });

    const org = await tx.tbl_organizations.update({
      where: { organization_id: newOrg.organization_id },
      data: {
        leader_unit_id: leaderUnit.unit_id,
        leader_position_id: leaderPosition.position_id,
      },
    });

    return { org, leaderUnit, leaderPosition };
  });

  return result.org;
}

function buildLeaderPositionAccess(usesReservations: boolean): position_accesses {
  const noReservations = {
    create: false,
    view: false,
    update: false,
    delete: false,
    cancel: false,
    approve: false,
    assignVehicle: false,
    odometerFuel: false,
    start: false,
    complete: false,
    viewOwn: false,
    viewAssigned: false,
    updateReason: false,
  };

  const fullReservations = {
    create: true,
    view: true,
    update: true,
    delete: true,
    cancel: true,
    approve: true,
    assignVehicle: true,
    odometerFuel: true,
    start: true,
    complete: true,
    viewOwn: true,
    viewAssigned: true,
    updateReason: true,
  };

  return {
    // Organizations module is hub SuperAdmin only — org leaders manage units/users/fleet, not orgs.
    organizations: { create: false, view: false, update: false, delete: false },
    units: { create: true, view: true, update: true, delete: true },
    positions: { create: true, view: true, update: true, delete: true, assignUser: true },
    users: { create: true, view: true, update: true, delete: true },
    vehicleModels: { create: false, view: true, viewSingle: true, update: false, delete: false },
    vehicles: { create: true, view: true, viewSingle: true, update: true, delete: true },
    reservations: usesReservations ? fullReservations : noReservations,
    vehicleIssues: { report: true, view: true, update: true, delete: true },
  };
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

// The SuperAdmin role is the protected hub-admin position. It must never be
// deactivated/deleted because doing so would lock everyone out of admin work.
const PROTECTED_POSITION_NAME = 'superadmin';

export function isProtectedSuperAdminPosition(positionName: string | null | undefined) {
  return (positionName ?? '').trim().toLowerCase() === PROTECTED_POSITION_NAME;
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

  if (isProtectedSuperAdminPosition(position.position_name)) {
    throw new AppError('The SuperAdmin position cannot be deactivated or deleted', 403);
  }

  if (normalizeCatalogName(position.position_name) === normalizeCatalogName(INUMA_APPROVER_IMOTRAK_POSITION)) {
    throw new AppError('The Assets & Services Administrator position cannot be deleted', 403);
  }

  // Get the requesting user's organization
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: userId },
    include: userPositionAssignmentsInclude,
  });

  const userPositions = user ? mapAssignmentsToPositions(user) : [];
  const userOrgId = userPositions[0]?.unit?.organization_id;

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
    where: { unit_id: unit_id, position_status: 'ACTIVE' },
    include: positionAssignmentsInclude,
  });

  return positions.map(enrichPositionResponse);
}

export async function getUnitsService(organization_id?: string) {
  const units = await prisma.tbl_unit.findMany({
    where: organization_id ? { organization_id } : undefined,
    include: {
      positions: true,
    },
    orderBy: { created_at: 'desc' },
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
      },
      ...positionAssignmentsInclude,
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

  return enrichPositionResponse(position);
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

  // Prevent silent deactivation of the protected SuperAdmin position via the
  // update endpoint (which would otherwise be a backdoor around the delete
  // guard).
  if (
    isProtectedSuperAdminPosition(position.position_name) &&
    (updateData as { position_status?: string }).position_status === 'INACTIVE'
  ) {
    throw new AppError('The SuperAdmin position cannot be deactivated', 403);
  }

  if (updateData.position_access) {
    updateData.position_access = clampPositionAccess(
      user.position_access as position_accesses,
      updateData.position_access as position_accesses
    ) as unknown as Prisma.InputJsonValue;
  }

  const updatedPosition = await prisma.tbl_position.update({
    where: { position_id },
    data: updateData
  });

  return updatedPosition;
};

export async function getPositionsService(organization_id?: string) {
  const positions = await prisma.tbl_position.findMany({
    where: {
      position_status: 'ACTIVE',
      ...(organization_id
        ? {
            unit: {
              organization_id: organization_id,
            },
          }
        : {}),
    },
    include: {
      unit: {
        include: {
          organization: true,
        },
      },
      ...positionAssignmentsInclude,
    },
  });

  return positions.map(enrichPositionResponse);
}

export const assignUserToPositionService = async ({
  position_id,
  user_email,
  user,
}: AssignUserToPositionParams) => {
  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: true,
      ...positionAssignmentsInclude,
    },
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }

  if (!user.position_access?.organizations?.create && position.unit.organization_id !== user.organization_id) {
    throw new AppError('You can only assign users to positions within your organization', 403);
  }

  const auth = await prisma.tbl_auth.findUnique({
    where: { email: user_email },
    include: { user: true },
  });

  if (!auth || !auth.user || auth.user_status !== 'ACTIVE') {
    throw new AppError('User with this email not found', 404);
  }

  const alreadyAssigned = await userHasPositionAssignment(
    prisma,
    auth.user.user_id,
    position_id
  );
  if (alreadyAssigned) {
    throw new AppError('User is already assigned to this position', 409);
  }

  await createUserPositionAssignment(prisma, auth.user.user_id, position_id);

  const updatedPosition = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: positionAssignmentsInclude,
  });

  if (!updatedPosition) {
    throw new AppError('Position not found', 404);
  }

  return enrichPositionResponse(updatedPosition);
};

