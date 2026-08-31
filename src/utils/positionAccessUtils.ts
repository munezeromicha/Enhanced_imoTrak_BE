import type { position_accesses } from '../types/access';

type AccessRecord = Record<string, Record<string, boolean>>;

/**
 * Every permission the system knows about, all switched off.
 *
 * Kept in step with `positionAccessSchema` and with the frontend's
 * `createEmptyPositionAccess`. A module that is missing from here is a module
 * the clamp cannot reason about, which is how the fuel module first became
 * impossible to delegate: positions stored before it existed had no `fuel` key,
 * so `requester.fuel` was undefined and every flag under it clamped to false.
 *
 * Returned from a factory rather than shared as a constant so no caller can
 * mutate the baseline another caller is about to read.
 */
export function createEmptyPositionAccess(): position_accesses {
  return {
    organizations: { create: false, view: false, update: false, delete: false },
    units: { create: false, view: false, update: false, delete: false },
    positions: { create: false, view: false, update: false, delete: false, assignUser: false },
    users: { create: false, view: false, update: false, delete: false },
    vehicleModels: { create: false, view: false, viewSingle: false, update: false, delete: false },
    vehicles: { create: false, view: false, viewSingle: false, update: false, delete: false },
    reservations: {
      create: false,
      view: false,
      update: false,
      delete: false,
      cancel: false,
      approve: false,
      assignVehicle: false,
      odometerFuel: false,
      start: false,
      complete: false,
      viewOwn: false,
      viewAssigned: false,
      updateReason: false,
    },
    vehicleIssues: { report: false, view: false, viewOwn: false, update: false, delete: false },
    fuel: {
      request: false,
      view: false,
      viewOwn: false,
      recommend: false,
      confirmFunding: false,
      issue: false,
      receive: false,
      replenish: false,
      viewReport: false,
      manageGenerators: false,
    },
  };
}

/**
 * Stored access filled out to the full shape, module by module.
 *
 * Absent still means "not granted" — nothing is switched on here. What changes
 * is that a flag which was never written now reads as an explicit `false`
 * instead of `undefined`, so a module added after a position was saved behaves
 * the same as one that was ticked off deliberately.
 */
export function normalizePositionAccess(
  stored: position_accesses | undefined | null
): position_accesses {
  const base = createEmptyPositionAccess() as unknown as AccessRecord;
  if (!stored || typeof stored !== 'object') return base as unknown as position_accesses;

  const source = stored as unknown as AccessRecord;
  for (const [module, perms] of Object.entries(source)) {
    if (!perms || typeof perms !== 'object') continue;
    base[module] = { ...(base[module] ?? {}), ...perms };
  }
  return base as unknown as position_accesses;
}

export function hasGlobalOrgAccess(access?: position_accesses): boolean {
  return !!access?.organizations?.create;
}

export function clampPositionAccess(
  requester: position_accesses | undefined,
  proposed: position_accesses
): position_accesses {
  if (hasGlobalOrgAccess(requester)) return proposed;
  if (!requester) return proposed;

  const requesterAccess = normalizePositionAccess(requester) as unknown as AccessRecord;
  const result = {} as AccessRecord;

  for (const module of Object.keys(proposed) as (keyof position_accesses)[]) {
    const proposedModule = proposed[module] as Record<string, boolean>;
    if (!proposedModule || typeof proposedModule !== 'object') continue;
    const requesterModule = requesterAccess[module as string] ?? {};
    const clampedModule: Record<string, boolean> = {};

    for (const perm of Object.keys(proposedModule)) {
      clampedModule[perm] = !!(proposedModule[perm] && requesterModule[perm]);
    }
    result[module as string] = clampedModule;
  }
  return result as unknown as position_accesses;
}

/**
 * The permissions a clamp would strip, as `module.permission` paths.
 *
 * The clamp is deliberately quiet — it filters rather than rejects, because
 * several callers hand it a whole template to trim. On the endpoints where a
 * person ticked the boxes themselves, silence is the wrong answer: the save
 * succeeds, the flags come back off, and there is nothing to explain why. This
 * gives those callers something to say.
 */
export function listDroppedPermissions(
  requester: position_accesses | undefined,
  proposed: position_accesses
): string[] {
  if (hasGlobalOrgAccess(requester) || !requester) return [];

  const requesterAccess = normalizePositionAccess(requester) as unknown as AccessRecord;
  const dropped: string[] = [];

  for (const [module, perms] of Object.entries(proposed as unknown as AccessRecord)) {
    if (!perms || typeof perms !== 'object') continue;
    for (const [perm, granted] of Object.entries(perms)) {
      if (granted && !requesterAccess[module]?.[perm]) {
        dropped.push(`${module}.${perm}`);
      }
    }
  }
  return dropped;
}

export function isPositionAccessSubset(
  requester: position_accesses | undefined,
  target: position_accesses
): boolean {
  if (hasGlobalOrgAccess(requester)) return true;
  if (!requester) return false;
  return listDroppedPermissions(requester, target).length === 0;
}

export function assertPositionAccessSubsetOrThrow(
  requester: position_accesses | undefined,
  target: position_accesses,
  message = 'You cannot grant permissions you do not have'
): void {
  if (!isPositionAccessSubset(requester, target)) {
    throw new Error(message);
  }
}

/**
 * Keep only flags that are true. Empty modules are dropped so stored overrides
 * stay a sparse delta rather than a second full copy of the position.
 */
export function compactAccessOverride(
  access: position_accesses | null | undefined
): Record<string, Record<string, boolean>> {
  const result: AccessRecord = {};
  if (!access || typeof access !== 'object') return result;

  for (const [moduleKey, perms] of Object.entries(access as unknown as AccessRecord)) {
    if (!perms || typeof perms !== 'object') continue;
    const kept: Record<string, boolean> = {};
    for (const [perm, granted] of Object.entries(perms)) {
      if (granted) kept[perm] = true;
    }
    if (Object.keys(kept).length > 0) result[moduleKey] = kept;
  }
  return result;
}

/**
 * Effective access = position baseline OR per-user extras.
 * Extras only add; they never turn off a flag the position already grants.
 */
export function mergePositionAccessWithOverride(
  base: position_accesses | null | undefined,
  override: position_accesses | null | undefined
): position_accesses {
  const merged = normalizePositionAccess(base) as unknown as AccessRecord;
  if (!override || typeof override !== 'object') {
    return merged as unknown as position_accesses;
  }

  const extra = override as unknown as AccessRecord;
  for (const [moduleKey, perms] of Object.entries(extra)) {
    if (!perms || typeof perms !== 'object') continue;
    merged[moduleKey] = { ...(merged[moduleKey] ?? {}) };
    for (const [perm, granted] of Object.entries(perms)) {
      if (granted) merged[moduleKey][perm] = true;
    }
  }
  return merged as unknown as position_accesses;
}
