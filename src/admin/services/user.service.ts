import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const UserService = {
  getUsers: async (
    status?: string,
    dobYear?: string,
    roleId?: string,
    name?: string
  ): Promise<
    {
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      orgName: string;
      role: string;
      dob: Date;
      phone: string | null;
      status: string;
    }[]
  > => {
    const filters: any = {};

    if (status && status !== 'All') {
      filters.status = status.toLowerCase();
    }

    if (dobYear) {
      const startDate = new Date(`${dobYear}-01-01`);
      const endDate = new Date(`${dobYear}-12-31`);
      filters.dob = {
        gte: startDate,
        lte: endDate
      };
    }

    if (roleId && roleId !== 'All') {
      filters.role_id = roleId;
    }

    if (name && name !== 'All') {
      filters.OR = [
        { first_name: { contains: name, mode: 'insensitive' } },
        { last_name: { contains: name, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.users.findMany({
      where: filters,
      include: {
        organizations: true,
        roles: true
      }
    });

    return users.map(user => ({
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      orgName: user.organizations.name,
      role: user.roles.name,
      dob: user.dob,
      phone: user.phone,
      status: user.status
    }));
  },

  getById: (id: string) => prisma.users.findUnique({ where: { id } }),

  create: (data: any) => prisma.users.create({ data }),

  update: (id: string, data: any) => prisma.users.update({
    where: { id },
    data
  }),

  delete: (id: string) => prisma.users.delete({ where: { id } }),
};
