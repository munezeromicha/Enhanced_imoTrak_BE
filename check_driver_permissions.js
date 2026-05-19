const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const driverUser = await prisma.tbl_users.findFirst({
    where: {
      auth: {
        email: 'obzvargas@gmail.com'
      }
    },
    include: {
      positions: true
    }
  });

  if (!driverUser) {
    console.log('Driver user not found');
    return;
  }

  console.log('User:', driverUser.first_name, driverUser.last_name);
  for (const up of driverUser.positions) {
    console.log('Position:', up.position_name);
    console.log('Access:', JSON.stringify(up.position_access, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
