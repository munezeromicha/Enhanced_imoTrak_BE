import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAuditLogs = async ({
  name,
  email,
  organization,
  startDate,
  endDate,
  page = 1,
  limit = 20,
}: {
  name?: string;
  email?: string;
  organization?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) => {
  const where: any = {
    AND: [],
  };

  if (name) {
    where.AND.push({
      user: {
        OR: [
          { first_name: { contains: name, mode: 'insensitive' } },
          { last_name: { contains: name, mode: 'insensitive' } },
        ],
      },
    });
  }

  if (email) {
    where.AND.push({
      user: {
        auth: {
          email: { contains: email, mode: 'insensitive' },
        },
      },
    });
  }

  if (organization) {
    where.AND.push({
      user: {
        positions: {
          some: {
            unit: {
              organization: {
                organization_name: { contains: organization, mode: 'insensitive' },
              },
            },
          },
        },
      },
    });
  }

  if (startDate && endDate) {
    where.AND.push({
      timestamp: { gte: startDate, lte: endDate },
    });
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.tbl_audit_logs.findMany({
      where,
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            auth: { select: { email: true } },
            positions: {
              select: {
                unit: {
                  select: {
                    organization: {
                      select: { organization_name: true },
                    },
                  },
                },
              },
            },
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
};

export default getAuditLogs;
