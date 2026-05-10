import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function isTruthy(v: string | undefined) {
  return v === '1' || v?.toLowerCase() === 'true' || v?.toLowerCase() === 'yes';
}

function parseList(v: string | undefined): string[] {
  if (!v) return [];
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function getPrismaCmd(): string {
  // Use local prisma binary (no npx) for deterministic behavior in containers.
  return process.platform === 'win32'
    ? 'node_modules\\.bin\\prisma.cmd'
    : 'node_modules/.bin/prisma';
}

type ExecResult = { stdout: string; stderr: string };

async function runPrisma(args: string[]): Promise<ExecResult> {
  const prismaCmd = getPrismaCmd();
  const { stdout, stderr } = await execFileAsync(prismaCmd, args, {
    env: process.env as NodeJS.ProcessEnv,
  });
  return { stdout: stdout?.toString() ?? '', stderr: stderr?.toString() ?? '' };
}

function log(line: string) {
  console.log(`[autoMigrate] ${line}`);
}

function logError(line: string) {
  console.error(`[autoMigrate] ${line}`);
}

/**
 * Allows the operator to mark specific migrations as resolved BEFORE
 * `prisma migrate deploy` runs, by providing one of:
 *   - RESOLVE_MIGRATIONS_AS_APPLIED=<name1>,<name2>
 *   - RESOLVE_MIGRATIONS_AS_ROLLED_BACK=<name1>,<name2>
 *
 * This is the standard recovery flow for the P3009 error
 * (https://pris.ly/d/migrate-resolve) but driven by env vars so that it can
 * happen automatically on the next container start, with no shell access.
 */
async function resolveOperatorRequestedMigrations() {
  const applied = parseList(process.env.RESOLVE_MIGRATIONS_AS_APPLIED);
  const rolledBack = parseList(process.env.RESOLVE_MIGRATIONS_AS_ROLLED_BACK);

  if (applied.length === 0 && rolledBack.length === 0) return;

  for (const name of rolledBack) {
    log(`Marking migration as rolled-back: ${name}`);
    try {
      const { stdout } = await runPrisma(['migrate', 'resolve', '--rolled-back', name]);
      if (stdout.trim()) log(stdout.trim());
    } catch (err: any) {
      const stderr = (err.stderr || '').toString();
      const stdout = (err.stdout || '').toString();
      logError(`Failed to mark ${name} as rolled-back.`);
      if (stdout) logError('stdout:\n' + stdout);
      if (stderr) logError('stderr:\n' + stderr);
    }
  }

  for (const name of applied) {
    log(`Marking migration as applied: ${name}`);
    try {
      const { stdout } = await runPrisma(['migrate', 'resolve', '--applied', name]);
      if (stdout.trim()) log(stdout.trim());
    } catch (err: any) {
      const stderr = (err.stderr || '').toString();
      const stdout = (err.stdout || '').toString();
      logError(`Failed to mark ${name} as applied.`);
      if (stdout) logError('stdout:\n' + stdout);
      if (stderr) logError('stderr:\n' + stderr);
    }
  }
}

function printP3009Help(failedMigration?: string) {
  const target = failedMigration ?? '<migration_name>';
  logError(
    [
      '',
      '================================================================',
      'P3009 detected: a previous migration is recorded as FAILED in the',
      '_prisma_migrations table. No new migrations will be applied until',
      'it is resolved.',
      '',
      `Failed migration: ${target}`,
      '',
      'Recovery options:',
      '',
      '  A) If the failed migration was actually fully applied to the DB',
      '     (e.g. the container was killed mid-migration but all SQL ran),',
      '     mark it as applied:',
      '',
      `       npx prisma migrate resolve --applied ${target}`,
      '',
      '  B) If the migration left the DB in a partial state and you have',
      '     manually undone its changes (or the changes were never made),',
      '     mark it as rolled-back so Prisma will retry it:',
      '',
      `       npx prisma migrate resolve --rolled-back ${target}`,
      '',
      '  C) Let this container resolve it automatically on the next start',
      '     by setting one of the following env vars on the service:',
      '',
      `       RESOLVE_MIGRATIONS_AS_APPLIED=${target}`,
      `       RESOLVE_MIGRATIONS_AS_ROLLED_BACK=${target}`,
      '',
      '  From inside the container you can also run:',
      '       npm run prisma:status',
      '       npm run prisma:resolve:applied -- ' + target,
      '       npm run prisma:resolve:rolled-back -- ' + target,
      '',
      'Docs: https://pris.ly/d/migrate-resolve',
      '================================================================',
      '',
    ].join('\n'),
  );
}

/**
 * Tries to extract the failed migration name from Prisma's P3009 stderr.
 * Example line: "The `20250714081715_migration` migration started at ... failed"
 */
function extractFailedMigrationName(text: string): string | undefined {
  const m = text.match(/The `([^`]+)` migration started at .* failed/);
  return m?.[1];
}

/**
 * Runs `prisma migrate deploy` on startup (intended for production environments
 * where you don't have shell access, but have automated deployments).
 *
 * Controls:
 * - ENABLE_AUTO_MIGRATE=true              -> force enable
 * - DISABLE_AUTO_MIGRATE=true             -> force disable (wins)
 * - NODE_ENV=production                   -> enables by default (unless disabled)
 * - MIGRATE_NON_BLOCKING=true             -> log+continue if migrate fails (don't crash)
 * - RESOLVE_MIGRATIONS_AS_APPLIED=a,b     -> pre-mark these as applied before deploy
 * - RESOLVE_MIGRATIONS_AS_ROLLED_BACK=a,b -> pre-mark these as rolled-back before deploy
 */
export async function autoMigrateIfNeeded() {
  if (isTruthy(process.env.DISABLE_AUTO_MIGRATE)) {
    log('DISABLE_AUTO_MIGRATE is set; skipping migrations.');
    return;
  }

  const shouldRun =
    isTruthy(process.env.ENABLE_AUTO_MIGRATE) || process.env.NODE_ENV === 'production';

  if (!shouldRun) return;

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set; cannot run prisma migrate deploy');
  }

  // Step 1: optionally resolve any failed migrations the operator has approved.
  await resolveOperatorRequestedMigrations();

  // Step 2: attempt the deploy.
  log('Running `prisma migrate deploy`...');
  try {
    const { stdout, stderr } = await runPrisma(['migrate', 'deploy']);
    if (stdout.trim()) log('stdout:\n' + stdout.trim());
    if (stderr.trim()) log('stderr:\n' + stderr.trim());
    log('Migrations applied successfully.');
  } catch (err: any) {
    const stdout = (err.stdout || '').toString();
    const stderr = (err.stderr || '').toString();

    logError('`prisma migrate deploy` failed.');
    if (stdout) logError('stdout:\n' + stdout);
    if (stderr) logError('stderr:\n' + stderr);

    const combined = stdout + '\n' + stderr;
    if (combined.includes('P3009')) {
      const failedName = extractFailedMigrationName(combined);
      printP3009Help(failedName);
    }

    if (isTruthy(process.env.MIGRATE_NON_BLOCKING)) {
      logError('MIGRATE_NON_BLOCKING is set; continuing startup despite migrate failure.');
      return;
    }

    // Re-throw a cleaner error so the outer `start()` log is readable.
    const e = new Error('prisma migrate deploy failed (see logs above for details)');
    (e as any).cause = err;
    throw e;
  }
}
