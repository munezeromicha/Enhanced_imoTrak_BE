import { PrismaClient } from '@prisma/client';

export const roles = async () => {

  const prisma = new PrismaClient();

  // 1. Ensure default roles exist
  const roles = [
    { name: 'admin', description: 'System Super Admin with all privileges' },
    { name: 'hr', description: 'Human Resources Manager' },
    { name: 'staff', description: 'Staff member with limited access' },
    { name: 'fleetmanager', description: 'Fleet Manager with vehicle management access' }
  ];

  for (const role of roles) {
    let existingRole = await prisma.roles.findFirst({ where: { name: role.name } });

    if (!existingRole) {
      existingRole = await prisma.roles.create({
        data: role,
      });
      console.log('-------------------------------------------------------------')
      console.log(`Role created: ${existingRole.id} - ${role.name}`);
      console.log('-------------------------------------------------------------')
    } else {
        console.log('-------------------------------------------------------------')
        console.log(`Role already exists: ${existingRole.id} - ${role.name}`);
        console.log('-------------------------------------------------------------')
    }
  }

  await prisma.$disconnect();
};