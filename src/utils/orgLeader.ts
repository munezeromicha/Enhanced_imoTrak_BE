import { PrismaClient } from '@prisma/client';
import type { position_accesses } from '../types/access';

const prisma = new PrismaClient();

export function isSuperAdmin(user: { position_access?: position_accesses }): boolean {
  // Hub SuperAdmin only — org leaders may have organizations.view for their own org,
  // so create (org provisioning) is the reliable hub-admin signal.
  return !!user.position_access?.organizations?.create;
}

export async function isOrgLeader(
  user: { position_id: string; position_access?: position_accesses }
): Promise<boolean> {
  if (isSuperAdmin(user)) return false;

  const position = await prisma.tbl_position.findUnique({
    where: { position_id: user.position_id },
    select: { is_org_leader: true },
  });
  return !!position?.is_org_leader;
}

export async function canViewOrgUnitCount(
  user: { position_id: string; position_access?: position_accesses }
): Promise<boolean> {
  if (isSuperAdmin(user)) return true;
  return isOrgLeader(user);
}

/**
 * Unit id to scope vehicle (and similar) queries. Null = no unit filter (hub super-admin or org leader).
 */
export async function resolveUnitScopeForUser(
  user: { position_id: string; position_access?: position_accesses }
): Promise<string | null> {
  if (isSuperAdmin(user)) return null;
  const leader = await isOrgLeader(user);
  if (leader) return null;

  const position = await prisma.tbl_position.findUnique({
    where: { position_id: user.position_id },
    select: { unit_id: true },
  });
  return position?.unit_id ?? null;
}
