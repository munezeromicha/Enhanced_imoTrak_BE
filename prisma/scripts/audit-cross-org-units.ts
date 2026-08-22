/**
 * Reports units that the Inuma catalog sync planted into the wrong tenant.
 *
 * Before the tenant guard in utils/inumaOrganization.ts, opening any
 * organization's detail page ran `ensureInumaCampusesListed` against that
 * organization, copying UR's campus list into it. This script finds those
 * leftovers so they can be reviewed.
 *
 *   npx ts-node prisma/scripts/audit-cross-org-units.ts            # report only
 *   npx ts-node prisma/scripts/audit-cross-org-units.ts --deactivate
 *
 * Report mode changes nothing. `--deactivate` sets status = INACTIVE on the
 * units that carry no positions and no vehicles; anything in use is always
 * left alone and listed for a human to decide on. Nothing is ever hard
 * deleted.
 */
import { PrismaClient } from '@prisma/client';
import { normalizeCampusName } from '../../src/constants/inuma';
import { getInumaCatalog } from '../../src/services/inuma-catalog.service';
import { resolveInumaOrganizationId } from '../../src/utils/inumaOrganization';

const prisma = new PrismaClient();

async function main() {
  const shouldDeactivate = process.argv.includes('--deactivate');

  const inumaOrgId = await resolveInumaOrganizationId();
  if (!inumaOrgId) {
    console.error(
      'No Inuma organization resolved. Set INUMA_ORGANIZATION_ID or ' +
        'INUMA_ORGANIZATION_NAME before running this script.'
    );
    process.exit(1);
  }

  const inumaOrg = await prisma.tbl_organizations.findUnique({
    where: { organization_id: inumaOrgId },
    select: { organization_name: true },
  });
  console.log(`Inuma organization: ${inumaOrg?.organization_name} (${inumaOrgId})\n`);

  const catalog = await getInumaCatalog();
  const catalogNames = new Set(
    catalog.campuses
      .filter((campus) => campus.name?.trim())
      .map((campus) => normalizeCampusName(campus.name))
  );

  if (catalogNames.size === 0) {
    console.error('Inuma catalog returned no campuses; cannot classify units.');
    process.exit(1);
  }

  // Units that look like Inuma campuses but live outside the Inuma org.
  const suspects = await prisma.tbl_unit.findMany({
    where: { organization_id: { not: inumaOrgId } },
    select: {
      unit_id: true,
      unit_name: true,
      status: true,
      organization: { select: { organization_name: true } },
      _count: { select: { positions: true, vehicles: true } },
    },
    orderBy: [{ organization_id: 'asc' }, { unit_name: 'asc' }],
  });

  const leaked = suspects.filter((unit) =>
    catalogNames.has(normalizeCampusName(unit.unit_name))
  );

  if (leaked.length === 0) {
    console.log('No cross-organization campus units found. Nothing to do.');
    return;
  }

  const safe = leaked.filter(
    (unit) => unit._count.positions === 0 && unit._count.vehicles === 0
  );
  const inUse = leaked.filter(
    (unit) => unit._count.positions > 0 || unit._count.vehicles > 0
  );

  console.log(`Found ${leaked.length} campus unit(s) outside the Inuma organization:\n`);
  for (const unit of leaked) {
    const usage = `${unit._count.positions} position(s), ${unit._count.vehicles} vehicle(s)`;
    const flag = unit._count.positions || unit._count.vehicles ? 'IN USE ' : 'unused ';
    console.log(
      `  ${flag} ${unit.organization.organization_name} → ${unit.unit_name} ` +
        `[${unit.status}] (${usage})`
    );
  }

  console.log(`\n  unused and safe to deactivate: ${safe.length}`);
  console.log(`  in use, needs a human decision: ${inUse.length}`);

  if (!shouldDeactivate) {
    console.log('\nReport only. Re-run with --deactivate to deactivate the unused ones.');
    return;
  }

  if (safe.length === 0) {
    console.log('\nNothing safe to deactivate.');
    return;
  }

  const result = await prisma.tbl_unit.updateMany({
    where: { unit_id: { in: safe.map((unit) => unit.unit_id) } },
    data: { status: 'INACTIVE' },
  });
  console.log(`\nDeactivated ${result.count} unused unit(s). Units in use were left untouched.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
