import { PrismaClient } from '@prisma/client';
import { isAuthorizedInumaApproverPosition } from '../constants/inuma';
import { AppError } from '../utils/Error';
import { canManageInumaAccess } from './inuma-access.service';
import { userPositionAssignmentsInclude } from '../utils/userPositions';

const prisma = new PrismaClient();

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

  const approverUnitId =
    user.auth.matched_unit_id ||
    activeAssignment?.position.unit.unit_id ||
    undefined;

  return { user, approverUnitId };
}

function assertSameCampus(
  approverUnitId: string | null | undefined,
  targetUnitId: string | null | undefined
) {
  if (!approverUnitId || !targetUnitId || approverUnitId === targetUnitId) {
    return;
  }

  throw new AppError(
    'You can only manage Inuma users from your campus',
    403
  );
}

export async function listPendingInumaAccessRequests(params: {
  approverUserId: string;
  unitId?: string;
}) {
  const { approverUnitId } = await assertApprover(params.approverUserId);

  if (params.unitId && approverUnitId && params.unitId !== approverUnitId) {
    throw new AppError(
      'You can only view Inuma users from your campus',
      403
    );
  }

  const campusUnitId = approverUnitId || params.unitId;
  if (!campusUnitId) {
    return [];
  }

  const ssoUsers = await prisma.tbl_auth.findMany({
    where: {
      sso_sub: { not: null },
      imotrak_access_approved_at: null,
      user_status: { in: ['ACTIVE', 'PENDING_APPROVAL'] },
      user: { isNot: null },
      matched_unit_id: campusUnitId,
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

export async function approveInumaAccessRequest(params: {
  approverUserId: string;
  targetUserId: string;
  positionId?: string;
}) {
  const { approverUnitId } = await assertApprover(params.approverUserId);

  const targetUser = await prisma.tbl_users.findUnique({
    where: { user_id: params.targetUserId },
    include: {
      auth: true,
      position_assignments: true,
    },
  });

  if (!targetUser?.auth) {
    throw new AppError('User not found', 404);
  }

  if (!targetUser.auth.sso_sub) {
    throw new AppError('This workflow only applies to Inuma SSO users', 400);
  }

  if (targetUser.auth.imotrak_access_approved_at) {
    throw new AppError('This user already has full permissions granted', 400);
  }

  assertSameCampus(approverUnitId, targetUser.auth.matched_unit_id);

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

  assertSameCampus(approverUnitId, position.unit_id);
  assertSameCampus(targetUser.auth.matched_unit_id, position.unit_id);

  await prisma.$transaction(async (tx) => {
    await tx.tbl_user_position_assignments.deleteMany({
      where: { user_id: targetUser.user_id },
    });

    await tx.tbl_user_position_assignments.create({
      data: {
        user_id: targetUser.user_id,
        position_id: positionId,
      },
    });

    await tx.tbl_auth.update({
      where: { auth_id: targetUser.auth!.auth_id },
      data: {
        user_status: 'ACTIVE',
        matched_position_id: positionId,
        matched_unit_id: position.unit_id,
        imotrak_access_approved_at: new Date(),
        imotrak_access_approved_by_user_id: params.approverUserId,
      },
    });
  });

  return prisma.tbl_users.findUniqueOrThrow({
    where: { user_id: targetUser.user_id },
    include: userPositionAssignmentsInclude,
  });
}

export async function rejectInumaAccessRequest(params: {
  approverUserId: string;
  targetUserId: string;
}) {
  const { approverUnitId } = await assertApprover(params.approverUserId);

  const targetUser = await prisma.tbl_users.findUnique({
    where: { user_id: params.targetUserId },
    include: { auth: true },
  });

  if (!targetUser?.auth) {
    throw new AppError('User not found', 404);
  }

  assertSameCampus(approverUnitId, targetUser.auth.matched_unit_id);

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
