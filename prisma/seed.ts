// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  // 1. Create the organization
  const organization = await prisma.tbl_organizations.upsert({
    where: { organization_name: 'Tekinova hub' },
    update: {},
    create: {
      organization_name: 'Tekinova hub',
      street_address: '123 Main Street',
      organization_phone: '250788123456',
      organization_email: 'info@tekinova.rw',
      organization_logo: 'tekinova_logo.png',
      organization_customId: 'TEK-HUB-001',
    },
  });

  // 2. Create the unit
  const unit = await prisma.tbl_unit.upsert({
    where: {
      unit_name_organization_id: {
        unit_name: 'Administrative',
        organization_id: organization.organization_id,
      },
    },
    update: {},
    create: {
      unit_name: 'Administrative',
      organization_id: organization.organization_id,
    },
  });

  // 3. Define full access JSON
  const fullAccess = {
    organizations: { create: true, view: true, update: true, delete: true },
    units: { create: true, view: true, update: true, delete: true },
    positions: { create: true, view: true, update: true, delete: true },
    users: { create: true, view: true, update: true, delete: true },
  };

  // 4. Create the position without user_id yet
  const position = await prisma.tbl_position.upsert({
    where: {
      position_name_unit_id: {
        position_name: 'SuperAdmin',
        unit_id: unit.unit_id,
      },
    },
    update: {},
    create: {
      position_name: 'SuperAdmin',
      position_description: 'Has full access to all resources.',
      position_access: fullAccess,
      unit_id: unit.unit_id,
    },
  });

  // 5. Hash password using Argon2
  const password = await argon2.hash('supersecurepassword');

  // 6. Create the auth record
  const auth = await prisma.tbl_auth.create({
    data: {
      email: 'superadmin@tekinova.rw',
      password,
    },
  });

  // 7. Create the user and link to auth
  const user = await prisma.tbl_users.create({
    data: {
      first_name: 'Tekinova',
      last_name: 'Admin',
      user_nid: '1234567890123456',
      user_phone: '250788654321',
      user_dob: new Date('1990-01-01'),
      user_gender: 'MALE',
      user_photo: 'https://avatars.githubusercontent.com/u/122959151?v=4',
      street_address: 'Admin Street',
      auth_id: auth.auth_id,
    },
  });

  // 8. Update the position to assign the user_id
  await prisma.tbl_position.update({
    where: { position_id: position.position_id },
    data: { user_id: user.user_id },
  });

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
