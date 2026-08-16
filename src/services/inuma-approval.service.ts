import { Prisma, PrismaClient } from '@prisma/client';
import { isAuthorizedInumaApproverPosition } from '../constants/inuma';
import { AppError } from '../utils/Error';
import { canManageInumaAccess } from './inuma-access.service';
import { userPositionAssignmentsInclude } from '../utils/userPositions';

const prisma = new PrismaClient();

/**
 * Confirms the caller may manage Inuma access and resolves the campus they
 * manage. An Assets and Services Management administrator is responsible for
 * one campus, so every list and every grant below is bounded by `campusUnitId`.
 */
async function assertApprover(userId: string) {
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: userId },
    include: {
      auth: true,
      position_assignments: {
        include: {
          position: {
            include: {
              unit: true,
            },
          },
        },
      },
    },
  });

  if (!user?.auth) {
    throw new AppError('User not found', 404);
  }

  const activeAssignment = user.position_assignments.find(
    (assignment) => assignment.position.position_status === 'ACTIVE'
  );
  const positionAccess = activeAssignment?.position.position_access as
    | import('../types/access').position_accesses
    | undefined;

  if (
    !canManageInumaAccess({
      inumaPosition: user.auth.inuma_position,
      positionAccess,
    })
  ) {
    throw new AppError(
      'Only authorized Assets and Services Management administrators can manage user permissions',
      403
    );
  }

  const campusUnitId =
    user.auth.matched_unit_id || activeAssignment?.position.unit_id || undefined;

  return { user, campusUnitId };
}

/** A campus administrator may only act on users matched to that same campus. */
function assertTargetInCampus(
  target: { matched_unit_id: string | null },
  campusUnitId: string | undefined,
  positionUnitIds: string[]
) {
  if (!campusUnitId) return;

  const inCampus =
    target.matched_unit_id === campusUnitId || positionUnitIds.includes(campusUnitId);

  if (!inCampus) {
    throw new AppError(
      'This user belongs to another campus. You can only manage users from your own campus.',
      403
    );
  }
}

/**
 * Inuma catalog positions are stored once, on the catalog unit. Granting one to
 * a campus user copies it into that campus so the user stays discoverable by
 * their campus administrator instead of moving to the catalog unit.
 */
async function materializePositionInCampus(
  position: Prisma.tbl_positionGetPayload<{ include: { unit: true } }>,
  campusUnitId: string | undefined
) {
  if (!campusUnitId || position.unit_id === campusUnitId) {
    return position.position_id;
  }

  const campusUnit = await prisma.tbl_unit.findUnique({
    where: { unit_id: campusUnitId },
  });

  // Never copy a position across organizations.
  if (!campusUnit || campusUnit.organization_id !== position.unit.organization_id) {
    return position.position_id;
  }

  const campusPosition = await prisma.tbl_position.upsert({
    where: {
      position_name_unit_id: {
        position_name: position.position_name,
        unit_id: campusUnitId,
      },
    },
    update: {
      position_access: position.position_access as Prisma.InputJsonValue,
      position_status: 'ACTIVE',
    },
    create: {
      position_name: position.position_name,
      position_description: position.position_description,
      position_access: position.position_access as Prisma.InputJsonValue,
      unit_id: campusUnitId,
      position_status: 'ACTIVE',
    },
  });

  return campusPosition.position_id;
}

export async function listPendingInumaAccessRequests(params: {
  approverUserId: string;
  unitId?: string;
}) {
  const { campusUnitId } = await assertApprover(params.approverUserId);

  // The approver's own campus always wins over the requested filter — asking
  // for another campus must not widen what comes back.
  const unitFilter = campusUnitId || params.unitId;

  const ssoUsers = await prisma.tbl_auth.findMany({
    where: {
      sso_sub: { not: null },
      imotrak_access_approved_at: null,
      user_status: { in: ['ACTIVE', 'PENDING_APPROVAL'] },
      user: { isNot: null },
      ...(unitFilter ? { matched_unit_id: unitFilter } : {}),
    },
    include: {
      user: {
        include: {
          position_assignments: {
            include: {
              position: {
                include: {
                  unit: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { updated_at: 'desc' },
  });

  const pending = ssoUsers.filter(
    (auth) => !isAuthorizedInumaApproverPosition(auth.inuma_position)
  );

  const unitIds = [
    ...new Set(pending.map((auth) => auth.matched_unit_id).filter(Boolean)),
  ] as string[];

  const units =
    unitIds.length > 0
      ? await prisma.tbl_unit.findMany({
          where: { unit_id: { in: unitIds } },
        })
      : [];

  const unitMap = new Map(units.map((unit) => [unit.unit_id, unit]));

  return pending.map((auth) => {
    const assignments = auth.user!.position_assignments.map((assignment) => ({
      position_id: assignment.position.position_id,
      position_name: assignment.position.position_name,
      unit_id: assignment.position.unit.unit_id,
      unit_name: assignment.position.unit.unit_name,
    }));

    return {
      auth_id: auth.auth_id,
      user_id: auth.user!.user_id,
      email: auth.email,
      first_name: auth.user!.first_name,
      last_name: auth.user!.last_name,
      inuma_position: auth.inuma_position,
      inuma_unit: auth.inuma_unit,
      inuma_campus_code: auth.inuma_campus_code,
      matched_unit_id: auth.matched_unit_id,
      matched_position_id: auth.matched_position_id,
      matched_unit_name: auth.matched_unit_id
        ? unitMap.get(auth.matched_unit_id)?.unit_name
        : undefined,
      current_positions: assignments,
      access_level: 'limited' as const,
      requested_at: auth.updated_at || auth.user!.created_at,
    };
  });
}

/**
 * Puts a campus user on an ImoTrak position, copying the chosen position into
 * the administrator's campus when it comes from the shared Inuma catalog.
 *
 * @param requireUnapproved Guards the first-time grant so an already-approved
 *   user is not silently re-granted; the reassign entry point clears it.
 */
async function grantCampusPosition(params: {
  approverUserId: string;
  targetUserId: string;
  positionId?: string;
  requireUnapproved: boolean;
}) {
  const { campusUnitId } = await assertApprover(params.approverUserId);

  const targetUser = await prisma.tbl_users.findUnique({
    where: { user_id: params.targetUserId },
    include: {
      auth: true,
      position_assignments: {
        include: { position: true },
      },
    },
  });

  if (!targetUser?.auth) {
    throw new AppError('User not found', 404);
  }

  assertTargetInCampus(
    targetUser.auth,
    campusUnitId,
    targetUser.position_assignments.map((assignment) => assignment.position.unit_id)
  );

  if (!targetUser.auth.sso_sub) {
    throw new AppError('This workflow only applies to Inuma SSO users', 400);
  }

  if (params.requireUnapproved && targetUser.auth.imotrak_access_approved_at) {
    throw new AppError('This user already has full permissions granted', 400);
  }

  const positionId =
    params.positionId ||
    targetUser.auth.matched_position_id ||
    undefined;

  if (!positionId) {
    throw new AppError(
      'Select an ImoTrak position to grant this user full permissions.',
      400
    );
  }

  const position = await prisma.tbl_position.findUnique({
    where: { position_id: positionId },
    include: { unit: true },
  });

  if (!position || position.position_status !== 'ACTIVE') {
    throw new AppError('Selected position is not active', 400);
  }

  const grantedPositionId = await materializePositionInCampus(position, campusUnitId);
  const grantedUnitId = campusUnitId || position.unit_id;

  await prisma.$transaction(async (tx) => {
    await tx.tbl_user_position_assignments.deleteMany({
      where: { user_id: targetUser.user_id },
    });

    await tx.tbl_user_position_assignments.create({
      data: {
        user_id: targetUser.user_id,
        position_id: grantedPositionId,
      },
    });

    await tx.tbl_auth.update({
      where: { auth_id: targetUser.auth!.auth_id },
      data: {
        user_status: 'ACTIVE',
        matched_position_id: grantedPositionId,
        matched_unit_id: grantedUnitId,
        imotrak_access_approved_at:
          targetUser.auth!.imotrak_access_approved_at || new Date(),
        imotrak_access_approved_by_user_id: params.approverUserId,
      },
    });
  });

  return prisma.tbl_users.findUniqueOrThrow({
    where: { user_id: targetUser.user_id },
    include: userPositionAssignmentsInclude,
  });
}

/** First-time grant: turns a limited Inuma sign-in into a full ImoTrak position. */
export async function approveInumaAccessRequest(params: {
  approverUserId: string;
  targetUserId: string;
  positionId?: string;
}) {
  return grantCampusPosition({ ...params, requireUnapproved: true });
}

/**
 * Moves an already-approved campus user to a different existing position —
 * the ongoing "manage my campus" action, as opposed to the one-off grant.
 */
export async function reassignInumaUserPosition(params: {
  approverUserId: string;
  targetUserId: string;
  positionId: string;
}) {
  if (!params.positionId) {
    throw new AppError('Select an ImoTrak position to assign.', 400);
  }
  return grantCampusPosition({ ...params, requireUnapproved: false });
}

export async function rejectInumaAccessRequest(params: {
  approverUserId: string;
  targetUserId: string;
}) {
  const { campusUnitId } = await assertApprover(params.approverUserId);

  const targetUser = await prisma.tbl_users.findUnique({
    where: { user_id: params.targetUserId },
    include: {
      auth: true,
      position_assignments: {
        include: { position: true },
      },
    },
  });

  if (!targetUser?.auth) {
    throw new AppError('User not found', 404);
  }

  assertTargetInCampus(
    targetUser.auth,
    campusUnitId,
    targetUser.position_assignments.map((assignment) => assignment.position.unit_id)
  );

  if (targetUser.auth.imotrak_access_approved_at) {
    throw new AppError('Cannot revoke access for a user with granted permissions here', 400);
  }

  await prisma.tbl_auth.update({
    where: { auth_id: targetUser.auth.auth_id },
    data: {
      user_status: 'INACTIVE',
    },
  });

  return { user_id: targetUser.user_id, status: 'INACTIVE' as const };
}
