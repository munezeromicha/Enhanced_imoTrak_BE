import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function isTruthy(v: string | undefined) {
  return v === '1' || v?.toLowerCase() === 'true' || v?.toLowerCase() === 'yes';
}

/**
 * Runs `prisma migrate deploy` on startup (intended for production environments
 * where you don't have shell access, but have automated deployments).
 *
 * Controls:
 * - ENABLE_AUTO_MIGRATE=true  -> force enable
 * - DISABLE_AUTO_MIGRATE=true -> force disable (wins)
 * - NODE_ENV=production       -> enables by default (unless disabled)
 */
export async function autoMigrateIfNeeded() {
  if (isTruthy(process.env.DISABLE_AUTO_MIGRATE)) return;

  const shouldRun =
    isTruthy(process.env.ENABLE_AUTO_MIGRATE) || process.env.NODE_ENV === 'production';

  if (!shouldRun) return;

  // Use local prisma binary (no npx) for deterministic behavior in containers.
  const prismaCmd =
    process.platform === 'win32'
      ? 'node_modules\\.bin\\prisma.cmd'
      : 'node_modules/.bin/prisma';

  // `prisma migrate deploy` requires DATABASE_URL.
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set; cannot run prisma migrate deploy');
  }

  await execFileAsync(prismaCmd, ['migrate', 'deploy'], {
    env: process.env as NodeJS.ProcessEnv,
  });
}

