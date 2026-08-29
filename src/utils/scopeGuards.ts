import { PrismaClient } from '@prisma/client';
import { AppError } from './Error';
import { isHubSuperAdmin, readableUnitIds, type AuthContext } from './authContext';

const prisma = new PrismaClient();

/**
 * Organization and unit guards for resource access.
 *
 * The rule these enforce, in order: does the row belong to your organization,
 * and — when you are unit-restricted — to a unit you may read? Detail endpoints
 * call these *after* loading the row; list endpoints use the where-fragment
 * helpers below so the filter happens in the database instead.
 */

/** Throws unless the row belongs to the requester's organization. */
export function assertOrgScope(
  ctx: AuthContext,
  resourceOrganizationId: string | null | undefined,
  resource = 'record'
): void {
  if (isHubSuperAdmin(ctx)) return;
  if (resourceOrganizationId && resourceOrganizationId === ctx.organizationId) return;
  // 404 rather than 403: confirming a row exists in another tenant is itself a
  // disclosure, and the caller has no legitimate way to know it is there.
  throw new AppError(`${resource} not found`, 404);
}

/**
 * Throws unless the row's unit is readable by the requester.
 *
 * A row with no unit is treated as organization-level and stays visible — units
 * were added to several tables after rows already existed, and hiding that
 * history would take access away from people who legitimately have it today.
 */
export function assertUnitScope(
  ctx: AuthContext,
  resourceUnitId: string | null | undefined,
  resource = 'record'
): void {
  const allowed = readableUnitIds(ctx);
  if (!allowed) return;
  if (!resourceUnitId) return;
  if (allowed.includes(resourceUnitId)) return;
  throw new AppError(`${resource} not found`, 404);
}

/** Both checks, in the order the audit's target architecture specifies. */
export function assertResourceScope(
  ctx: AuthContext,
  resource: { organization_id?: string | null; unit_id?: string | null },
  label = 'record'
): void {
  assertOrgScope(ctx, resource.organization_id, label);
  assertUnitScope(ctx, resource.unit_id, label);
}

/**
 * A Prisma `where` fragment confining a list query to the readable units.
 *
 * `unit_id: null` rows are included for the reason given on `assertUnitScope`.
 * Spread this into a where clause: `{ organization_id, ...unitWhere(ctx) }`.
 */
export function unitWhere(
  ctx: AuthContext,
  extraUnitIds: string[] = []
): Record<string, unknown> {
  const allowed = readableUnitIds(ctx);
  if (!allowed) return {};
  const ids = [...new Set([...allowed, ...extraUnitIds])];
  return { OR: [{ unit_id: { in: ids } }, { unit_id: null }] };
}

/**
 * The organization a write must land in.
 *
 * Client-supplied organization ids were how vehicles and units could be created
 * inside another tenant. The rule now: the value is derived from the session,
 * and a client that sends a different one is refused rather than silently
 * corrected, so an integration bug surfaces instead of hiding.
 *
 * Hub SuperAdmins may name any organization — provisioning across tenants is
 * their explicit job.
 */
export function resolveWriteOrganizationId(
  ctx: AuthContext,
  requested?: string | null
): string {
  if (isHubSuperAdmin(ctx)) return requested || ctx.organizationId;
  if (requested && requested !== ctx.organizationId) {
    throw new AppError('You cannot create or move records in another organization', 403);
  }
  return ctx.organizationId;
}

/**
 * The unit a write must land in.
 *
 * A unit-restricted requester writes to their own unit and nowhere else. A
 * requester who reads across units may name any unit, but only inside their own
 * organization — verified against the database, not assumed.
 */
export async function resolveWriteUnitId(
  ctx: AuthContext,
  requested?: string | null
): Promise<string | null> {
  const allowed = readableUnitIds(ctx);

  if (allowed) {
    if (requested && !allowed.includes(requested)) {
      throw new AppError('You can only create records in your own unit', 403);
    }
    return requested ?? ctx.unitId ?? null;
  }

  if (!requested) return null;

  const unit = await prisma.tbl_unit.findUnique({
    where: { unit_id: requested },
    select: { organization_id: true },
  });
  if (!unit) throw new AppError('Unit not found', 404);

  if (!isHubSuperAdmin(ctx) && unit.organization_id !== ctx.organizationId) {
    throw new AppError('That unit belongs to another organization', 403);
  }
  return requested;
}
