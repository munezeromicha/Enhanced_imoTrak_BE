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

type ResolveMode = 'applied' | 'rolled-back' | null;

function parseResolveMode(v: string | undefined): ResolveMode {
  if (!v) return null;
  const norm = v.toLowerCase().trim().replace('_', '-');
  if (norm === 'applied') return 'applied';
  if (norm === 'rolled-back' || norm === 'rolledback') return 'rolled-back';
  return null;
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
 */
async function resolveOperatorRequestedMigrations() {
  const applied = parseList(process.env.RESOLVE_MIGRATIONS_AS_APPLIED);
  const rolledBack = parseList(process.env.RESOLVE_MIGRATIONS_AS_ROLLED_BACK);

  if (applied.length === 0 && rolledBack.length === 0) return;

  for (const name of rolledBack) {
    await resolveMigration(name, 'rolled-back');
  }
  for (const name of applied) {
    await resolveMigration(name, 'applied');
  }
}

async function resolveMigration(name: string, mode: 'applied' | 'rolled-back'): Promise<boolean> {
  const flag = mode === 'applied' ? '--applied' : '--rolled-back';
  log(`Resolving migration ${flag} ${name}`);
  try {
    const { stdout } = await runPrisma(['migrate', 'resolve', flag, name]);
    if (stdout.trim()) log(stdout.trim());
    return true;
  } catch (err: any) {
    const stderr = (err.stderr || '').toString();
    const stdout = (err.stdout || '').toString();
    logError(`Failed to resolve ${name} ${flag}.`);
    if (stdout) logError('stdout:\n' + stdout);
    if (stderr) logError('stderr:\n' + stderr);
    return false;
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
      '  A) Fully automatic, generic (handles any future P3009 too):',
      '       AUTO_RESOLVE_FAILED_MIGRATIONS=applied        # if the SQL did run',
      '       AUTO_RESOLVE_FAILED_MIGRATIONS=rolled-back    # if the SQL did NOT run',
      '     Then restart the container.',
      '',
      '  B) Targeted, pre-deploy resolve (specific migrations only):',
      `       RESOLVE_MIGRATIONS_AS_APPLIED=${target}`,
      `       RESOLVE_MIGRATIONS_AS_ROLLED_BACK=${target}`,
      '     Then restart the container.',
      '',
      '  C) From inside the container:',
      '       npm run prisma:status',
      `       npm run prisma:resolve:applied -- ${target}`,
      `       npm run prisma:resolve:rolled-back -- ${target}`,
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
 * Runs `prisma migrate deploy`. Returns the result on success; on failure,
 * returns the captured stdout/stderr so the caller can decide what to do.
 */
async function deployOnce(): Promise<{ ok: true } | { ok: false; stdout: string; stderr: string; raw: any }> {
  try {
    const { stdout, stderr } = await runPrisma(['migrate', 'deploy']);
    if (stdout.trim()) log('stdout:\n' + stdout.trim());
    if (stderr.trim()) log('stderr:\n' + stderr.trim());
    return { ok: true };
  } catch (err: any) {
    return {
      ok: false,
      stdout: (err.stdout || '').toString(),
      stderr: (err.stderr || '').toString(),
      raw: err,
    };
  }
}

/**
 * Runs `prisma migrate deploy` on startup (intended for production environments
 * where you don't have shell access, but have automated deployments).
 *
 * Controls:
 * - ENABLE_AUTO_MIGRATE=true                       -> force enable
 * - DISABLE_AUTO_MIGRATE=true                      -> force disable (wins)
 * - NODE_ENV=production                            -> enables by default
 * - MIGRATE_NON_BLOCKING=true                      -> log+continue if migrate fails
 * - RESOLVE_MIGRATIONS_AS_APPLIED=a,b              -> pre-mark these as applied
 * - RESOLVE_MIGRATIONS_AS_ROLLED_BACK=a,b          -> pre-mark these as rolled-back
 * - AUTO_RESOLVE_FAILED_MIGRATIONS=applied         -> on P3009, auto-resolve the
 *                                                     failed migration as applied,
 *                                                     then retry deploy
 * - AUTO_RESOLVE_FAILED_MIGRATIONS=rolled-back     -> same, but as rolled-back
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

  await resolveOperatorRequestedMigrations();

  log('Running `prisma migrate deploy`...');
  let result = await deployOnce();

  // P3009 auto-recovery loop. Each iteration resolves at most one failed
  // migration (the one Prisma is currently complaining about) and retries.
  // We cap the number of iterations to the number of migrations to avoid
  // any chance of an infinite loop.
  const autoMode = parseResolveMode(process.env.AUTO_RESOLVE_FAILED_MIGRATIONS);
  const maxIterations = 20;
  let iterations = 0;
  const alreadyResolved = new Set<string>();

  while (!result.ok && autoMode && iterations < maxIterations) {
    const combined = result.stdout + '\n' + result.stderr;
    if (!combined.includes('P3009')) break;

    const failedName = extractFailedMigrationName(combined);
    if (!failedName) break;

    if (alreadyResolved.has(failedName)) {
      logError(`Auto-resolve already attempted for ${failedName}; aborting recovery loop.`);
      break;
    }

    logError('`prisma migrate deploy` failed with P3009.');
    if (result.stderr) logError('stderr:\n' + result.stderr);

    log(
      `AUTO_RESOLVE_FAILED_MIGRATIONS=${autoMode}; auto-resolving ${failedName} and retrying deploy...`,
    );

    const resolved = await resolveMigration(failedName, autoMode);
    alreadyResolved.add(failedName);
    if (!resolved) break;

    iterations += 1;
    log(`Retrying \`prisma migrate deploy\` (attempt ${iterations + 1})...`);
    result = await deployOnce();
  }

  if (result.ok) {
    log('Migrations applied successfully.');
    return;
  }

  // Final failure path.
  logError('`prisma migrate deploy` failed.');
  if (result.stdout) logError('stdout:\n' + result.stdout);
  if (result.stderr) logError('stderr:\n' + result.stderr);

  const combined = result.stdout + '\n' + result.stderr;
  if (combined.includes('P3009')) {
    const failedName = extractFailedMigrationName(combined);
    printP3009Help(failedName);
  }

  if (isTruthy(process.env.MIGRATE_NON_BLOCKING)) {
    logError('MIGRATE_NON_BLOCKING is set; continuing startup despite migrate failure.');
    return;
  }

  const e = new Error('prisma migrate deploy failed (see logs above for details)');
  (e as any).cause = result.raw;
  throw e;
}
