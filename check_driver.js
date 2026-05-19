const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const driver = await prisma.tbl_drivers.findFirst({
    where: {
      user: {
        auth: {
          email: 'obzvargas@gmail.com'
        }
      }
    },
    include: {
      user: true,
      assignments: {
        include: {
          reserved_vehicle: {
            include: {
              reservation: true
            }
          }
        }
      }
    }
  });

  if (!driver) {
    console.log('Driver record not found in tbl_drivers');
    return;
  }

  console.log('Driver ID:', driver.driver_id);
  console.log('License:', driver.license_number);
  console.log('User ID in driver table:', driver.user_id);
  console.log('Assignments count:', driver.assignments.length);
  for (const ass of driver.assignments) {
    console.log('- Assignment ID:', ass.assignment_id);
    console.log('  Active:', ass.is_active);
    console.log('  Reservation ID:', ass.reserved_vehicle.reservation.reservation_id);
    console.log('  Purpose:', ass.reserved_vehicle.reservation.reservation_purpose);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
