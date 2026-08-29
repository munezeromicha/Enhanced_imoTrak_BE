import { PrismaClient } from '@prisma/client';
import type { position_accesses } from '../types/access';
import { normalizePositionAccess } from './positionAccessUtils';

const prisma = new PrismaClient();

/**
 * The single authorization context for a request.
 *
 * Before this existed the backend answered "which unit is this person in?" in
 * two unrelated places — `campusScope.resolveCampusScope` keyed off the Inuma
 * campus, `orgLeader.resolveUnitScopeForUser` keyed off the position's unit —
 * and for real users the two disagreed. Permissions and scope must come from
 * the same place or a module can grant what another module would refuse.
 *
 * Everything an authorization decision needs is resolved here, once per
 * request, and every guard reads it rather than recomputing its own answer.
 */
export type PrivilegeLevel = 'HUB_SUPERADMIN' | 'ORG_LEADER' | 'MEMBER';

export interface AuthContext {
  userId: string;
  positionId: string;
  organizationId: string;
  /**
   * The unit that owns the position this session was issued for.
   *
   * Authoritative for authorization. `tbl_auth.matched_unit_id` — the Inuma
   * campus — is deliberately *not* used here: permissions live on the position,
   * the session is issued per position, and the JWT's organization is already
   * derived from the position's unit. Scope has to follow the same thread.
   * `matched_unit_id` remains what it was always good for: deciding which unit
   * to create a position under on a first SSO sign-in.
   */
  unitId: string | null;
  /** Full permission shape — a module absent from storage reads as all false. */
  permissions: position_accesses;
  privilege: PrivilegeLevel;
  /**
   * True when reads must be confined to `unitId`.
   *
   * Org-wide reading is a privilege, granted three ways: hub SuperAdmin, the
   * organization's leader, or a position holding `units.view` — which is the
   * existing system's way of saying "this role operates above one unit".
   * Everyone else sees their own unit. That keeps the 33 administrative
   * positions working exactly as before while confining ordinary staff.
   */
  unitRestricted: boolean;
}

/** Minimal shape `attachPositionAccess` leaves on the request. */
export type RequestUser = {
  user_id: string;
  position_id: string;
  organization_id: string;
  unit_id?: string | null;
  position_access?: unknown;
  is_org_leader?: boolean;
};

function readsAcrossUnits(access: position_accesses, isOrgLeader: boolean): boolean {
  if (access.organizations?.create) return true;
  if (isOrgLeader) return true;
  return !!access.units?.view;
}

/**
 * Build the context for a request.
 *
 * `is_org_leader` is read from the database rather than trusted from the token,
 * because the token is minted once at sign-in and the flag can be cleared after.
 */
export async function resolveAuthContext(user: RequestUser): Promise<AuthContext> {
  const permissions = normalizePositionAccess(
    (user.position_access ?? null) as position_accesses | null
  );

  const position = await prisma.tbl_position.findUnique({
    where: { position_id: user.position_id },
    select: { unit_id: true, is_org_leader: true },
  });

  const isOrgLeader = !!position?.is_org_leader;
  const isHubSuperAdmin = !!permissions.organizations?.create;

  const privilege: PrivilegeLevel = isHubSuperAdmin
    ? 'HUB_SUPERADMIN'
    : isOrgLeader
      ? 'ORG_LEADER'
      : 'MEMBER';

  return {
    userId: user.user_id,
    positionId: user.position_id,
    organizationId: user.organization_id,
    unitId: position?.unit_id ?? user.unit_id ?? null,
    permissions,
    privilege,
    unitRestricted:
      !isHubSuperAdmin && !readsAcrossUnits(permissions, isOrgLeader),
  };
}

/** A hub SuperAdmin provisions organizations and is never tenant-bound. */
export function isHubSuperAdmin(ctx: AuthContext): boolean {
  return ctx.privilege === 'HUB_SUPERADMIN';
}

/**
 * The unit ids a requester may read, or `undefined` for "no unit filter".
 *
 * Returned as a list so callers can widen it deliberately — the fuel module
 * adds the shared vehicle pool — without every caller re-deriving the base.
 */
export function readableUnitIds(ctx: AuthContext): string[] | undefined {
  if (!ctx.unitRestricted) return undefined;
  return ctx.unitId ? [ctx.unitId] : [];
}

/**
 * Dot-path permission lookup, e.g. `has(ctx, 'fuel.issue')`.
 *
 * Unknown module or action returns false rather than throwing: a typo must fail
 * closed, never open.
 */
export function has(ctx: AuthContext, permission: string): boolean {
  const [moduleKey, action] = permission.split('.');
  if (!moduleKey || !action) return false;
  const modulePerms = (ctx.permissions as unknown as Record<
    string,
    Record<string, boolean> | undefined
  >)[moduleKey];
  return !!modulePerms?.[action];
}

/** True when the requester holds at least one of the listed permissions. */
export function hasAny(ctx: AuthContext, permissions: string[]): boolean {
  return permissions.some((permission) => has(ctx, permission));
}
