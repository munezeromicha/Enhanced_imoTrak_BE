import { PrismaClient, UserStatus, Gender } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('SuperAdmin@123', 10);
  const superAdminAuth = await prisma.tbl_auth.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      password,
      user_status: UserStatus.ACTIVE,
    },
  });

  // Find user by auth_id
  const existingUser = await prisma.tbl_users.findFirst({
    where: { auth_id: superAdminAuth.auth_id },
  });

  await prisma.tbl_users.upsert({
    where: { user_id: existingUser?.user_id ?? '' }, 
    update: {},
    create: {
      first_name: 'Super',
      last_name: 'Admin',
      user_nid: '1200080024860014',
      user_phone: '+250790962901',
      user_dob: new Date('2000-01-01'),
      user_photo: null,
      user_gender: Gender.MALE,
      street_address: 'Admin Street 1',
      auth_id: superAdminAuth.auth_id,
    },
  });

  console.log('SuperAdmin seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 