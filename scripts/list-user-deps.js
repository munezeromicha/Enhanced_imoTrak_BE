require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.tbl_users.findMany({
    select: { user_id: true, first_name: true, last_name: true },
  });
  for (const u of users) {
    const [res, drv, pa, issues, replies] = await Promise.all([
      p.tbl_reservations.count({ where: { user_id: u.user_id } }),
      p.tbl_drivers.count({ where: { user_id: u.user_id } }),
      p.tbl_user_position_assignments.count({ where: { user_id: u.user_id } }),
      p.tbl_vehicle_issues.count({ where: { reported_by_user_id: u.user_id } }),
      p.tbl_vehicle_issue_replies.count({ where: { user_id: u.user_id } }),
    ]);
    if (res || drv || issues || replies) {
      console.log(
        `${u.first_name} ${u.last_name} (${u.user_id}) res:${res} drv:${drv} pa:${pa} issues:${issues} replies:${replies}`
      );
    }
  }
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
