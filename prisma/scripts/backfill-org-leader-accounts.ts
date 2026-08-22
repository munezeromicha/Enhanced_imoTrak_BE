/**
 * Repairs organizations whose email has no sign-in account behind it.
 *
 * `organization_email` used to be a plain contact field, so editing it left
 * the new address unable to sign in ("Account not found"). The update path now
 * keeps the two in step; this script fixes the organizations that were edited
 * before that existed.
 *
 *   npx ts-node prisma/scripts/backfill-org-leader-accounts.ts          # report
 *   npx ts-node prisma/scripts/backfill-org-leader-accounts.ts --fix
 *   npx ts-node prisma/scripts/backfill-org-leader-accounts.ts --fix --org <id>
 *
 * Report mode changes nothing. `--fix` runs the same sync the update endpoint
 * uses: an existing leader login moves to the organization's email, and an
 * organization with no leader account gets one plus a set-password invitation.
 * Organizations whose email already signs in are skipped.
 */
import { PrismaClient } from '@prisma/client';
import { ensureOrganizationLeaderAccount } from '../../src/services/organization.services';

const prisma = new PrismaClient();

async function main() {
  const shouldFix = process.argv.includes('--fix');
  const orgFlagIndex = process.argv.indexOf('--org');
  const onlyOrgId = orgFlagIndex !== -1 ? process.argv[orgFlagIndex + 1] : undefined;

  const organizations = await prisma.tbl_organizations.findMany({
    where: {
      organization_status: 'ACTIVE',
      ...(onlyOrgId ? { organization_id: onlyOrgId } : {}),
    },
    orderBy: { created_at: 'asc' },
  });

  if (organizations.length === 0) {
    console.log('No matching active organizations.');
    return;
  }

  const needsWork: typeof organizations = [];

  for (const org of organizations) {
    const email = org.organization_email?.trim().toLowerCase();
    if (!email) {
      console.log(`  skip     ${org.organization_name} — no email set`);
      continue;
    }

    const account = await prisma.tbl_auth.findUnique({ where: { email } });

    if (account) {
      console.log(`  ok       ${org.organization_name} — ${email} already signs in`);
      continue;
    }

    console.log(`  BROKEN   ${org.organization_name} — ${email} has no account`);
    needsWork.push(org);
  }

  console.log(`\n${needsWork.length} organization(s) need a leader account.`);

  if (needsWork.length === 0) return;

  if (!shouldFix) {
    console.log('Report only. Re-run with --fix to create or move the leader logins.');
    return;
  }

  for (const org of needsWork) {
    try {
      const result = await ensureOrganizationLeaderAccount(org.organization_id);
      console.log(`  ${org.organization_name}: ${result.action}`);
    } catch (error) {
      console.error(
        `  ${org.organization_name}: FAILED — ${(error as Error).message}`
      );
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
