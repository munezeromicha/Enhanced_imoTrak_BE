import { Prisma } from '@prisma/client';

/** Standard include for loading a user's assigned positions with unit/org. */
export const userPositionAssignmentsInclude = {
  position_assignments: {
    include: {
      position: {
        include: {
          unit: {
            include: {
              organization: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.tbl_usersInclude;

export type UserWithPositionAssignments = Prisma.tbl_usersGetPayload<{
  include: typeof userPositionAssignmentsInclude;
}>;

export function mapAssignmentsToPositions(user: UserWithPositionAssignments) {
  return user.position_assignments.map((a) => a.position);
}

/** Include for position endpoints that list assigned users. */
export const positionAssignmentsInclude = {
  assignments: {
    include: {
      user: {
        include: {
          auth: {
            select: { email: true },
          },
        },
      },
    },
  },
} satisfies Prisma.tbl_positionInclude;

export type PositionWithAssignments = Prisma.tbl_positionGetPayload<{
  include: typeof positionAssignmentsInclude;
}>;

export function mapPositionAssignedUsers(position: PositionWithAssignments) {
  return position.assignments.map((a) => a.user);
}

/** API shape: assigned_users array + legacy single `user` / `user_id` for first assignee. */
export function enrichPositionResponse<T extends PositionWithAssignments>(position: T) {
  const assigned_users = mapPositionAssignedUsers(position);
  const { assignments, ...rest } = position;
  return {
    ...rest,
    assigned_users,
    user: assigned_users[0] ?? null,
    user_id: assigned_users[0]?.user_id ?? null,
  };
}

export async function createUserPositionAssignment(
  tx: Prisma.TransactionClient,
  user_id: string,
  position_id: string
) {
  return tx.tbl_user_position_assignments.upsert({
    where: {
      user_id_position_id: { user_id, position_id },
    },
    create: { user_id, position_id },
    update: {},
  });
}

export async function userHasPositionAssignment(
  prisma: Prisma.TransactionClient | Prisma.DefaultPrismaClient,
  user_id: string,
  position_id: string
): Promise<boolean> {
  const row = await prisma.tbl_user_position_assignments.findUnique({
    where: { user_id_position_id: { user_id, position_id } },
    select: { assignment_id: true },
  });
  return !!row;
}
