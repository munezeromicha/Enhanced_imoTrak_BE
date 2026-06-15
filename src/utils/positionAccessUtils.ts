import type { position_accesses } from '../types/access';

export function hasGlobalOrgAccess(access?: position_accesses): boolean {
  return !!access?.organizations?.create;
}

export function clampPositionAccess(
  requester: position_accesses | undefined,
  proposed: position_accesses
): position_accesses {
  if (hasGlobalOrgAccess(requester)) return proposed;
  if (!requester) return proposed;

  const result = {} as position_accesses;
  for (const module of Object.keys(proposed) as (keyof position_accesses)[]) {
    const proposedModule = proposed[module] as Record<string, boolean>;
    const requesterModule = (requester[module] ?? {}) as Record<string, boolean>;
    const clampedModule: Record<string, boolean> = {};

    for (const perm of Object.keys(proposedModule)) {
      clampedModule[perm] = !!(proposedModule[perm] && requesterModule[perm]);
    }
    (result as unknown as Record<string, Record<string, boolean>>)[module] = clampedModule;
  }
  return result;
}

export function isPositionAccessSubset(
  requester: position_accesses | undefined,
  target: position_accesses
): boolean {
  if (hasGlobalOrgAccess(requester)) return true;
  if (!requester) return false;

  for (const module of Object.keys(target) as (keyof position_accesses)[]) {
    const targetModule = target[module] as Record<string, boolean>;
    const requesterModule = (requester[module] ?? {}) as Record<string, boolean>;

    for (const perm of Object.keys(targetModule)) {
      if (targetModule[perm] && !requesterModule[perm]) {
        return false;
      }
    }
  }
  return true;
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
