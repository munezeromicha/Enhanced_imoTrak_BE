import prisma from '../prisma/prisma.client';

/**
 * Audit logs the requester is allowed to read.
 *
 * `organizationId` is not optional and is not taken from the query string. The
 * previous signature accepted an `organization` filter from the caller and then
 * never applied it, so every log in every tenant came back to anyone with a
 * token. It is now derived from the session and always applied — except for a
 * hub SuperAdmin, who may deliberately read across tenants.
 *
 * Scoped by the acting user's organization rather than by a column on the log,
 * because `tbl_audit_logs` has no organization of its own: it records who acted,
 * and the actor's organization is what makes the entry ours or someone else's.
 */
export async function getAuditLogs(filters: {
  name?: string;
  email?: string;
  organizationId: string | null;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
}) {
  const { page, limit, startDate, endDate, organizationId } = filters;

  const skip = (page - 1) * limit;

  const where: any = {
    timestamp: {
      gte: startDate ?? new Date('1970-01-01'),
      lte: endDate ?? new Date(),
    },
  };

  if (organizationId) {
    where.user = {
      position_assignments: {
        some: { position: { unit: { organization_id: organizationId } } },
      },
    };
  }

  // Merged into any organization filter above rather than replacing it — an
  // assignment here is what silently dropped tenant scoping before.
  if (filters.name || filters.email) {
    where.user = {
      ...(where.user ?? {}),
      ...(filters.name && {
        OR: [
          { first_name: { contains: filters.name, mode: 'insensitive' } },
          { last_name:  { contains: filters.name, mode: 'insensitive' } },
        ],
      }),
      ...(filters.email && {
        auth: { email: { contains: filters.email, mode: 'insensitive' } },
      }),
    };
  }

  const [logs, total] = await Promise.all([
    prisma.tbl_audit_logs.findMany({
      where,
      include: {
        user: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
            // Explicit projection, never `auth: true` — that included
            // tbl_auth.password, the argon2 hash, in every response.
            auth: { select: { email: true } },
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      skip,
      take: limit,
    }),
    prisma.tbl_audit_logs.count({ where }),
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function createAuditLog(data: {
  action: string;
  previous_value?: object;
  new_value?: object;
  userId: string;
  table_name?: string;
  record_id?: string;
  ip_address?: string;
  user_agent?: string;
}) {
  try {
    await prisma.tbl_audit_logs.create({
      data: {
        action: data.action,
        old_value: data.previous_value,
        new_value: data.new_value,
        user_id: data.userId,
        table_name: data.table_name,
        record_id: data.record_id,
        ip_address: data.ip_address ?? 'unknown',
        user_agent: data.user_agent ?? 'unknown',
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}

export async function updateUserService({
  id,
  newData,
  actingUserId,
  ip_address,
  user_agent,
}: {
  id: string;
  newData: any;
  actingUserId: string;
  ip_address?: string;
  user_agent?: string;
}) {
  const existingUser = await prisma.tbl_users.findUnique({
    where: { user_id: id },
  });

  if (!existingUser) {
    throw new Error('User not found');
  }

  const updatedUser = await prisma.tbl_users.update({
    where: { user_id: id },
    data: newData,
  });

  await createAuditLog({
    action: 'UPDATE_USER',
    previous_value: existingUser,
    new_value: updatedUser,
    userId: actingUserId,
    table_name: 'tbl_users',
    record_id: id,
    ip_address: ip_address,
    user_agent: user_agent,
  });

  return updatedUser;
}
