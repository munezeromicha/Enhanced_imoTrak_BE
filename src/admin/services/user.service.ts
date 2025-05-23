import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const UserService = {
  getAll: () => prisma.users.findMany(),

  getById: (id: string) => prisma.users.findUnique({ where: { id } }),

  create: (data: any) => prisma.users.create({ data }),

  update: (id: string, data: any) => prisma.users.update({
    where: { id },
    data
  }),

  delete: (id: string) => prisma.users.delete({ where: { id } }),
};
