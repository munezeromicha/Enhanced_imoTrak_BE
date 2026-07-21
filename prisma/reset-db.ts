// prisma/reset-db.ts
//
// Wipes every row from the application tables while keeping the schema and
// migration history intact (TRUNCATE ... CASCADE, not a schema drop). Intended
// for clearing stale data so a fresh seed / fresh app run shows the latest state.
//
// This is destructive and irreversible, so it refuses to run unless explicitly
// confirmed:
//   npm run db:wipe -- --yes            (or)   CONFIRM_WIPE=YES npm run db:wipe
//
// It also refuses in production unless additionally forced with --force.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Never truncated: Prisma's own migration bookkeeping. */
const PROTECTED_TABLES = new Set(['_prisma_migrations']);

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

/** Show which database is about to be wiped, without leaking credentials. */
function describeTarget(): string {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
  try {
    const { host, pathname } = new URL(url);
    return `${host}${pathname}`;
  } catch {
    return '(unparseable DATABASE_URL)';
  }
}

async function main() {
  const confirmed = hasFlag('--yes') || process.env.CONFIRM_WIPE === 'YES';
  const isProd = process.env.NODE_ENV === 'production';

  if (!confirmed) {
    console.error(
      '\n✋ Refusing to wipe the database without confirmation.\n' +
        `   Target: ${describeTarget()}\n\n` +
        '   This deletes ALL rows from every table. To proceed:\n' +
        '     npm run db:wipe -- --yes\n'
    );
    process.exit(1);
  }

  if (isProd && !hasFlag('--force')) {
    console.error(
      '\n✋ NODE_ENV=production. Refusing to wipe a production database.\n' +
        '   If you are absolutely certain, re-run with --force.\n'
    );
    process.exit(1);
  }

  console.log(`\n🧹 Wiping all data from: ${describeTarget()}`);

  // Discover every base table in the public schema at runtime, so new models
  // are covered automatically and we never truncate views or Prisma's tables.
  const rows = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  `;

  const tables = rows
    .map((r) => r.tablename)
    .filter((name) => !PROTECTED_TABLES.has(name));

  if (tables.length === 0) {
    console.log('   Nothing to truncate.');
    return;
  }

  // One statement, CASCADE to satisfy FKs, RESTART IDENTITY to reset sequences.
  const quoted = tables.map((t) => `"public"."${t}"`).join(', ');
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE;`
  );

  console.log(`   Truncated ${tables.length} table(s):`);
  console.log(`   ${tables.sort().join(', ')}`);
  console.log('✅ Database wiped.\n');
}

main()
  .catch((err) => {
    console.error('❌ Database wipe failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
