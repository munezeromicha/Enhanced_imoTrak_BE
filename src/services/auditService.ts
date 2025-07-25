import prisma from '../prisma/prisma.client';

export async function getAuditLogs(filters: {
  name?: string;
  email?: string;
  organization?: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
}) {
  const { page, limit, startDate, endDate } = filters;

  const skip = (page - 1) * limit;

  const where: any = {
    timestamp: {
      gte: startDate ?? new Date('1970-01-01'),
      lte: endDate ?? new Date(),
    },
  };

  // Apply filters
  if (filters.name || filters.email || filters.organization) {
    where.user = {
      ...(filters.name && { name: { contains: filters.name, mode: 'insensitive' } }),
      ...(filters.email && { email: { contains: filters.email, mode: 'insensitive' } }),
      ...(filters.organization && {
        organization: { contains: filters.organization, mode: 'insensitive' },
      }),
    };
  }

  const [logs, total] = await Promise.all([
    prisma.tbl_audit_logs.findMany({
      where,
      include: { user: true },
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
