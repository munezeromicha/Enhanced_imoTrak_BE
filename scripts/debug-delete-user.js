require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const targetUserId = process.argv[2] || '72f5a59e-bb11-4855-88d9-14ce0830c10b';
const prisma = new PrismaClient();

async function count(label, fn) {
  const n = await fn();
  console.log(`${label}: ${n}`);
  return n;
}

async function main() {
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: targetUserId },
    select: { user_id: true, first_name: true, last_name: true, auth_id: true },
  });
  console.log('User:', user);
  if (!user) return;

  await count('position_assignments', () =>
    prisma.tbl_user_position_assignments.count({ where: { user_id: targetUserId } })
  );
  await count('reservations owned', () =>
    prisma.tbl_reservations.count({ where: { user_id: targetUserId } })
  );
  await count('driver profile', () =>
    prisma.tbl_drivers.count({ where: { user_id: targetUserId } })
  );
  await count('issues reported', () =>
    prisma.tbl_vehicle_issues.count({ where: { reported_by_user_id: targetUserId } })
  );
  await count('issue replies by user', () =>
    prisma.tbl_vehicle_issue_replies.count({ where: { user_id: targetUserId } })
  );

  const reservations = await prisma.tbl_reservations.findMany({
    where: { user_id: targetUserId },
    select: { reservation_id: true },
  });
  const reservationIds = reservations.map((r) => r.reservation_id);
  const reserved = reservationIds.length
    ? await prisma.tbl_reserved_vehicles.findMany({
        where: { reservation_id: { in: reservationIds } },
        select: { reserved_vehicle_id: true, replaced_by_id: true },
      })
    : [];
  console.log('reserved vehicles:', reserved.length);
  if (reserved.length) console.log(reserved.slice(0, 5));

  // Find another user to use as actor
  const actor = await prisma.tbl_users.findFirst({
    where: { NOT: { user_id: targetUserId } },
    select: { user_id: true },
  });
  if (!actor) {
    console.log('No actor user found');
    return;
  }

  console.log('\nAttempting delete via service...');
  require('ts-node/register');
  const { deleteUserPermanentlyService } = require('../src/services/user.services');
  await deleteUserPermanentlyService({
    targetUserId,
    actorUserId: actor.user_id,
  });
  console.log('DELETE OK');
}

main()
  .catch((e) => {
    console.error('\nDELETE FAILED');
    console.error('code:', e.code);
    console.error('message:', e.message);
    if (e.meta) console.error('meta:', JSON.stringify(e.meta, null, 2));
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
