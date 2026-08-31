import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { position_accesses } from '../types/access';

/**
 * Authorization rules, tested without a database.
 *
 * These cover the decision logic itself — what a permission set allows, which
 * units a requester may read, and what a write is permitted to land on. That is
 * where every finding in the audit actually lived: no bug needed a real row to
 * reproduce, only the wrong answer from a guard.
 *
 * Prisma is mocked rather than connected. The configured DATABASE_URL points at
 * the live database, and a test suite must never be one careless `--run` away
 * from writing to it.
 */

const findUniquePosition = vi.fn();
const findUniqueUnit = vi.fn();

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    tbl_position = { findUnique: findUniquePosition };
    tbl_unit = { findUnique: findUniqueUnit };
  },
}));

const {
  resolveAuthContext,
  readableUnitIds,
  has,
  hasAny,
  isHubSuperAdmin,
} = await import('../utils/authContext');

const {
  assertOrgScope,
  assertUnitScope,
  assertResourceScope,
  unitWhere,
  resolveWriteOrganizationId,
  resolveWriteUnitId,
} = await import('../utils/scopeGuards');

const { normalizePositionAccess, mergePositionAccessWithOverride } = await import('../utils/positionAccessUtils');

const ORG_A = 'org-a';
const ORG_B = 'org-b';
const UNIT_A = 'unit-a';
const UNIT_B = 'unit-b';

/** A permission set with everything off — what a new account now receives. */
function noAccess(): position_accesses {
  return normalizePositionAccess(null);
}

function accessWith(patch: Record<string, Record<string, boolean>>): position_accesses {
  return normalizePositionAccess(patch as unknown as position_accesses);
}

async function contextFor(options: {
  access?: position_accesses;
  unitId?: string | null;
  organizationId?: string;
  isOrgLeader?: boolean;
}) {
  findUniquePosition.mockResolvedValue({
    unit_id: options.unitId ?? UNIT_A,
    is_org_leader: options.isOrgLeader ?? false,
  });
  return resolveAuthContext({
    user_id: 'user-1',
    position_id: 'position-1',
    organization_id: options.organizationId ?? ORG_A,
    position_access: options.access ?? noAccess(),
  });
}

beforeEach(() => {
  findUniquePosition.mockReset();
  findUniqueUnit.mockReset();
});

describe('a new user has zero permissions', () => {
  it('grants nothing at all', async () => {
    const ctx = await contextFor({ access: noAccess() });

    for (const permission of [
      'reservations.create',
      'reservations.viewOwn',
      'vehicleIssues.report',
      'vehicleIssues.viewOwn',
      'fuel.request',
      'fuel.receive',
      'vehicles.view',
      'users.view',
    ]) {
      expect(has(ctx, permission), `${permission} must be denied`).toBe(false);
    }
  });

  it('is not a hub SuperAdmin and is confined to its own unit', async () => {
    const ctx = await contextFor({ access: noAccess() });
    expect(isHubSuperAdmin(ctx)).toBe(false);
    expect(ctx.unitRestricted).toBe(true);
    expect(readableUnitIds(ctx)).toEqual([UNIT_A]);
  });

  it('denies a permission that does not exist rather than throwing', async () => {
    const ctx = await contextFor({ access: noAccess() });
    expect(has(ctx, 'nonsense.action')).toBe(false);
    expect(has(ctx, 'malformed')).toBe(false);
  });
});

describe('permission checks', () => {
  it('allows exactly what is granted', async () => {
    const ctx = await contextFor({ access: accessWith({ fuel: { issue: true } }) });
    expect(has(ctx, 'fuel.issue')).toBe(true);
    expect(has(ctx, 'fuel.confirmFunding')).toBe(false);
  });

  it('treats a module missing from storage as denied, not unknown', async () => {
    const stored = { vehicles: { view: true } } as unknown as position_accesses;
    const ctx = await contextFor({ access: normalizePositionAccess(stored) });
    expect(has(ctx, 'vehicles.view')).toBe(true);
    expect(has(ctx, 'fuel.request')).toBe(false);
  });

  it('hasAny passes when one of several is held', async () => {
    const ctx = await contextFor({ access: accessWith({ reservations: { viewOwn: true } }) });
    expect(hasAny(ctx, ['reservations.view', 'reservations.viewOwn'])).toBe(true);
    expect(hasAny(ctx, ['reservations.view', 'reservations.approve'])).toBe(false);
  });
});

describe('per-user extra access', () => {
  it('adds personal extras on top of the position without removing shared flags', () => {
    const position = accessWith({ reservations: { create: true, viewOwn: true } });
    const extra = { vehicleIssues: { viewOwn: true } } as unknown as position_accesses;
    const effective = mergePositionAccessWithOverride(position, extra);
    expect(effective.reservations.create).toBe(true);
    expect(effective.reservations.viewOwn).toBe(true);
    expect(effective.vehicleIssues.viewOwn).toBe(true);
    expect(effective.vehicleIssues.view).toBe(false);
  });

  it('cannot turn off a permission the position already grants', () => {
    const position = accessWith({ reservations: { create: true } });
    const extra = { reservations: { create: false } } as unknown as position_accesses;
    const effective = mergePositionAccessWithOverride(position, extra);
    expect(effective.reservations.create).toBe(true);
  });
});

describe('who may read across units', () => {
  it('confines an ordinary member to their own unit', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { view: true } }) });
    expect(readableUnitIds(ctx)).toEqual([UNIT_A]);
  });

  it('lets a hub SuperAdmin read everything', async () => {
    const ctx = await contextFor({ access: accessWith({ organizations: { create: true } }) });
    expect(ctx.privilege).toBe('HUB_SUPERADMIN');
    expect(readableUnitIds(ctx)).toBeUndefined();
  });

  it('lets an organization leader read across units', async () => {
    const ctx = await contextFor({ access: noAccess(), isOrgLeader: true });
    expect(ctx.privilege).toBe('ORG_LEADER');
    expect(readableUnitIds(ctx)).toBeUndefined();
  });

  it('lets a position holding units.view read across units', async () => {
    const ctx = await contextFor({ access: accessWith({ units: { view: true } }) });
    expect(readableUnitIds(ctx)).toBeUndefined();
  });

  it('resolves the unit from the position, not the Inuma campus', async () => {
    findUniquePosition.mockResolvedValue({ unit_id: UNIT_B, is_org_leader: false });
    const ctx = await resolveAuthContext({
      user_id: 'user-1',
      position_id: 'position-1',
      organization_id: ORG_A,
      unit_id: UNIT_A,
      position_access: noAccess(),
    });
    expect(ctx.unitId).toBe(UNIT_B);
  });
});

describe('organization isolation', () => {
  it('refuses a record from another organization', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { view: true } }) });
    expect(() => assertOrgScope(ctx, ORG_B, 'Vehicle')).toThrowError(/not found/i);
  });

  it('allows a record from the requester organization', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { view: true } }) });
    expect(() => assertOrgScope(ctx, ORG_A, 'Vehicle')).not.toThrow();
  });

  it('reports 404 rather than 403, so existence is not disclosed', async () => {
    const ctx = await contextFor({ access: noAccess() });
    try {
      assertOrgScope(ctx, ORG_B, 'Vehicle');
      throw new Error('expected a refusal');
    } catch (error) {
      expect((error as { statusCode?: number }).statusCode).toBe(404);
    }
  });

  it('lets a hub SuperAdmin cross organizations', async () => {
    const ctx = await contextFor({ access: accessWith({ organizations: { create: true } }) });
    expect(() => assertOrgScope(ctx, ORG_B)).not.toThrow();
  });
});

describe('unit isolation', () => {
  it("refuses another unit's record", async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { view: true } }) });
    expect(() => assertUnitScope(ctx, UNIT_B, 'Vehicle')).toThrowError(/not found/i);
  });

  it('allows the requester own unit', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { view: true } }) });
    expect(() => assertUnitScope(ctx, UNIT_A)).not.toThrow();
  });

  it('keeps records that predate the unit column visible', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { view: true } }) });
    expect(() => assertUnitScope(ctx, null)).not.toThrow();
  });

  it('checks organization before unit', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { view: true } }) });
    expect(() =>
      assertResourceScope(ctx, { organization_id: ORG_B, unit_id: UNIT_A }, 'Vehicle')
    ).toThrowError(/not found/i);
  });

  it('builds a list filter for a restricted requester', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { view: true } }) });
    expect(unitWhere(ctx)).toEqual({
      OR: [{ unit_id: { in: [UNIT_A] } }, { unit_id: null }],
    });
  });

  it('builds no filter for a requester who reads across units', async () => {
    const ctx = await contextFor({ access: accessWith({ units: { view: true } }) });
    expect(unitWhere(ctx)).toEqual({});
  });

  it('widens the filter with extra units when a caller asks', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { view: true } }) });
    const where = unitWhere(ctx, ['fleet-pool']) as { OR: { unit_id: { in: string[] } }[] };
    expect(where.OR[0].unit_id.in).toEqual([UNIT_A, 'fleet-pool']);
  });
});

describe('writes may not choose their own tenant', () => {
  it('refuses a foreign organization id in the body', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { create: true } }) });
    expect(() => resolveWriteOrganizationId(ctx, ORG_B)).toThrowError(/another organization/i);
  });

  it('derives the organization when none is supplied', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { create: true } }) });
    expect(resolveWriteOrganizationId(ctx, undefined)).toBe(ORG_A);
  });

  it('accepts the requester own organization spelled out', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { create: true } }) });
    expect(resolveWriteOrganizationId(ctx, ORG_A)).toBe(ORG_A);
  });

  it('lets a hub SuperAdmin name any organization', async () => {
    const ctx = await contextFor({ access: accessWith({ organizations: { create: true } }) });
    expect(resolveWriteOrganizationId(ctx, ORG_B)).toBe(ORG_B);
  });

  it('refuses a foreign unit id for a restricted requester', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { create: true } }) });
    await expect(resolveWriteUnitId(ctx, UNIT_B)).rejects.toThrowError(/your own unit/i);
  });

  it('defaults a restricted requester to their own unit', async () => {
    const ctx = await contextFor({ access: accessWith({ vehicles: { create: true } }) });
    await expect(resolveWriteUnitId(ctx, undefined)).resolves.toBe(UNIT_A);
  });

  it("refuses a cross-unit write into another organization's unit", async () => {
    const ctx = await contextFor({ access: accessWith({ units: { view: true } }) });
    findUniqueUnit.mockResolvedValue({ organization_id: ORG_B });
    await expect(resolveWriteUnitId(ctx, UNIT_B)).rejects.toThrowError(/another organization/i);
  });

  it('allows a cross-unit write inside the requester organization', async () => {
    const ctx = await contextFor({ access: accessWith({ units: { view: true } }) });
    findUniqueUnit.mockResolvedValue({ organization_id: ORG_A });
    await expect(resolveWriteUnitId(ctx, UNIT_B)).resolves.toBe(UNIT_B);
  });

  it('refuses a unit that does not exist', async () => {
    const ctx = await contextFor({ access: accessWith({ units: { view: true } }) });
    findUniqueUnit.mockResolvedValue(null);
    await expect(resolveWriteUnitId(ctx, 'ghost')).rejects.toThrowError(/not found/i);
  });
});

describe('administrators keep the access they had', () => {
  it('a hub SuperAdmin still passes every check', async () => {
    const ctx = await contextFor({ access: accessWith({ organizations: { create: true } }) });
    expect(readableUnitIds(ctx)).toBeUndefined();
    expect(() => assertResourceScope(ctx, { organization_id: ORG_B, unit_id: UNIT_B })).not.toThrow();
    expect(resolveWriteOrganizationId(ctx, ORG_B)).toBe(ORG_B);
  });

  it('a fleet administrator holding units.view keeps organization-wide reads', async () => {
    const ctx = await contextFor({
      access: accessWith({
        units: { view: true },
        vehicles: { view: true, create: true, update: true },
      }),
    });
    expect(readableUnitIds(ctx)).toBeUndefined();
    expect(() => assertUnitScope(ctx, UNIT_B)).not.toThrow();
    // Still tenant-bound, though.
    expect(() => assertOrgScope(ctx, ORG_B)).toThrow();
  });
});
