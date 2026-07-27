/**
 * One-off: remove Organizations module access from every position
 * except SuperAdmin. Safe to re-run.
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const positions = await prisma.tbl_position.findMany({
    select: { position_id: true, position_name: true, position_access: true },
  });

  let updated = 0;
  for (const pos of positions) {
    if (pos.position_name === 'SuperAdmin') continue;
    const access = pos.position_access ?? {};
    const orgs = access.organizations;
    if (!orgs) continue;
    if (!orgs.create && !orgs.view && !orgs.update && !orgs.delete) continue;

    await prisma.tbl_position.update({
      where: { position_id: pos.position_id },
      data: {
        position_access: {
          ...access,
          organizations: { create: false, view: false, update: false, delete: false },
        },
      },
    });
    updated += 1;
    console.log(`Stripped organizations access from: ${pos.position_name} (${pos.position_id})`);
  }

  console.log(`Done. Updated ${updated} position(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
