import { Gender, PrismaClient, users } from '@prisma/client';
import { roles } from '../../../utils/seedAdmin';
const prisma = new PrismaClient();

interface hrUdates {
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string,
  streetAddress?: string,
  status?: string
  dob?: Date,
  nid?: string,
  gender?: Gender,
}

export const UserService = {
  getUsers: async (
    status?: string,
    dobYear?: string,
    roleId?: string,
    name?: string
  ): Promise<
    {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      orgName: string;
      role: string;
      roleId: string;
      dob: Date;
      phone: string | null;
      status: string;
    }[]
  > => {
    const filters: any = {
      roles: {
        name: 'hr'
      }
    };

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
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      orgName: user.organizations.name,
      role: user.roles.name,
      roleId: user.role_id,
      dob: user.dob,
      phone: user.phone,
      status: user.status
    }));
  },

  getById: async (id: string) => {
  return await prisma.users.findFirst({
    where: {
      id,
      roles: {
        name: 'hr'
      }
    },
    include: {
      roles: true,
      organizations: true
    }
  });
},

  create: async (data: any) => {
    const user = await prisma.users.create({
      data: {
        first_name: data.firstName!,
        last_name: data.lastName!,
        email: data.email!,
        password_hash: data.password_hash!,
        phone: data.phone,
        nid: data.nid!,
        gender: data.gender!.toUpperCase(),
        dob: new Date(data.dob!),
        role_id: data.role!,
        street_address: data.streetAddress,
        organization_id: data.organizationId!,
      },
    });

    return user;
  },

  update: async (id: string, data: hrUdates) =>  {
    const updates: any = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      street_address: data.streetAddress,
      status: data.status,
      nid:data.nid,
      gender: data.gender
    }

    if (data.dob !== undefined) {
      updates.dob = new Date(data.dob);
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: updates
    })

    return updatedUser;
  },

  delete: (id: string) => prisma.users.delete({ where: { id } }),
};
