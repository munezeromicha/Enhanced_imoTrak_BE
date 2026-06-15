import { PrismaClient } from '@prisma/client';
import type { position_accesses } from '../types/access';

const prisma = new PrismaClient();

export function isSuperAdmin(user: { position_access?: position_accesses }): boolean {
  return !!user.position_access?.organizations?.view;
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
