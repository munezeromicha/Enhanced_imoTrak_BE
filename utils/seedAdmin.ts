import { PrismaClient } from '@prisma/client';
import { generateCustomId } from './generateCustomId';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

export const roles = async () => {

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
      // console.log('-------------------------------------------------------------')
      // console.log(`Role created: ${existingRole.id} - ${role.name}`);
      // console.log('-------------------------------------------------------------')
    } else {
        // console.log('-------------------------------------------------------------')
        // console.log(`Role already exists: ${existingRole.id} - ${role.name}`);
        // console.log('-------------------------------------------------------------')
    }
  }
};
export const seedAdmin = async () => {
  const orgName = 'Binary Hub';
  const orgCustomId = generateCustomId(orgName);


  let org = await prisma.organizations.findFirst({ where: { name: orgName } });

  if (!org) {
    org = await prisma.organizations.create({
      data: {
        customId: orgCustomId,
        name: orgName,
        address: 'Kigali, Rwanda',
        phone: '+250791287640',
        email: 'info@binaryhub.rw',
      },
    });
    //  console.log(`✅ Organization created: ${org.id}`);
  } else {
    // console.log(`ℹ️ Organization already exists: ${org.id}`);
  }
  await roles();

  const roleName = 'admin';
  const defaultRoleId = process.env.SUPERADMIN_ROLE_ID || 'superadmin-role-id';

  let role = await prisma.roles.findFirst({ where: { name: roleName } });

  if (!role) {
    role = await prisma.roles.create({
      data: {
      
        name: roleName,
        description: 'System Super Admin with all privileges',
      },
    });
    //  console.log(`✅ Super Admin role created: ${role.id}`);
  } else {
    //  console.log(`ℹ️ Super Admin role already exists: ${role.id}`);
  }


  const superadminEmail = process.env.SUPERADMIN_EMAIL || '';
  const superadminPassword = process.env.SUPERADMIN_PASSWORD || '';
  const superadminFirstName = process.env.SUPERADMIN_FIRSTNAME || '';
  const superadminLastName = process.env.SUPERADMIN_LASTNAME || '';
  const superadminDob = process.env.SUPERADMIN_DOB || '';

  const existingUser = await prisma.users.findUnique({
    where: { email: superadminEmail },
  });

  if (!existingUser) {
    const password_hash = await argon2.hash(superadminPassword);

    const user = await prisma.users.create({
      data: {
        email: superadminEmail,
        password_hash,
        first_name: superadminFirstName,
        last_name: superadminLastName,
        dob: new Date(superadminDob),
        organization_id: org.id,
        role_id: role.id,
        gender: 'MALE',
        street_address: "KN 7 Ave, Kigali",
        nid:"1199930098765432"
      },
    });

    //  console.log(`✅ Super Admin user created: ${user.id}`);
  } else {
    //  console.log(`ℹ️ Super Admin user already exists: ${existingUser.id}`);
  }
};