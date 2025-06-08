import { PrismaClient } from '@prisma/client';
import { generateCustomId } from './generateCustomId';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const orgName = 'Binary Hub';
  const orgCustomId = generateCustomId(orgName);

  // 1. Create or find organization
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
    console.log(`✅ Organization created: ${org.id}`);
  } else {
    console.log(`ℹ️ Organization already exists: ${org.id}`);
  }

  // 2. Ensure superadmin role exists
  const roleName = 'Super Admin';
  const defaultRoleId = process.env.SUPERADMIN_ROLE_ID || 'superadmin-role-id';

  let role = await prisma.roles.findFirst({ where: { name: roleName } });

  if (!role) {
    role = await prisma.roles.create({
      data: {
        id: defaultRoleId,
        name: roleName,
        description: 'System Super Admin with all privileges',
      },
    });
    console.log(`✅ Super Admin role created: ${role.id}`);
  } else {
    console.log(`ℹ️ Super Admin role already exists: ${role.id}`);
  }

  // 3. Create superadmin user if not exists
  const superadminUsername = process.env.SUPERADMIN_USERNAME || 'admin';
  const superadminEmail = process.env.SUPERADMIN_EMAIL || 'admin@example.com';
  const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'admin123';
  const superadminFirstName = process.env.SUPERADMIN_FIRSTNAME || 'Super';
  const superadminLastName = process.env.SUPERADMIN_LASTNAME || 'Admin';

  const existingUser = await prisma.users.findUnique({
    where: { email: superadminEmail },
  });

  if (!existingUser) {
    const password_hash = await argon2.hash(superadminPassword);

    const user = await prisma.users.create({
      data: {
        username: superadminUsername,
        email: superadminEmail,
        password_hash,
        first_name: superadminFirstName,
        last_name: superadminLastName,
        organization_id: org.id,
        role_id: role.id,
      },
    });

    console.log(`✅ Super Admin user created: ${user.id}`);
  } else {
    console.log(`ℹ️ Super Admin user already exists: ${existingUser.id}`);
  }
}