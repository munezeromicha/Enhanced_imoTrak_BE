import { PrismaClient } from '@prisma/client';
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
          position: true,
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
      'Only authorized Assets and Services Management administrators can manage access requests',
      403
    );
  }

  return user;
}

export async function listPendingInumaAccessRequests(params: {
  approverUserId: string;
  unitId?: string;
}) {
  await assertApprover(params.approverUserId);

  const pending = await prisma.tbl_auth.findMany({
    where: {
      user_status: 'PENDING_APPROVAL',
      user: { isNot: null },
      ...(params.unitId ? { matched_unit_id: params.unitId } : {}),
    },
    include: {
      user: true,
    },
    orderBy: { updated_at: 'desc' },
  });

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

  return pending.map((auth) => ({
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
    requested_at: auth.updated_at || auth.user!.created_at,
  }));
}

export async function approveInumaAccessRequest(params: {
  approverUserId: string;
  targetUserId: string;
  positionId?: string;
}) {
  await assertApprover(params.approverUserId);

  const targetUser = await prisma.tbl_users.findUnique({
    where: { user_id: params.targetUserId },
    include: { auth: true },
  });

  if (!targetUser?.auth) {
    throw new AppError('User not found', 404);
  }

  if (targetUser.auth.user_status !== 'PENDING_APPROVAL') {
    throw new AppError('This user is not awaiting access approval', 400);
  }

  const positionId =
    params.positionId ||
    targetUser.auth.matched_position_id ||
    undefined;

  if (!positionId) {
    throw new AppError(
      'No ImoTrak position could be matched for this user. Select a position when approving.',
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

  if (
    targetUser.auth.matched_unit_id &&
    position.unit_id !== targetUser.auth.matched_unit_id
  ) {
    throw new AppError(
      'Selected position must belong to the user matched campus unit',
      400
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.tbl_user_position_assignments.upsert({
      where: {
        user_id_position_id: {
          user_id: targetUser.user_id,
          position_id: positionId,
        },
      },
      update: {},
      create: {
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
  await assertApprover(params.approverUserId);

  const targetUser = await prisma.tbl_users.findUnique({
    where: { user_id: params.targetUserId },
    include: { auth: true },
  });

  if (!targetUser?.auth) {
    throw new AppError('User not found', 404);
  }

  if (targetUser.auth.user_status !== 'PENDING_APPROVAL') {
    throw new AppError('This user is not awaiting access approval', 400);
  }

  await prisma.tbl_auth.update({
    where: { auth_id: targetUser.auth.auth_id },
    data: {
      user_status: 'INACTIVE',
    },
  });

  return { user_id: targetUser.user_id, status: 'INACTIVE' as const };
}
