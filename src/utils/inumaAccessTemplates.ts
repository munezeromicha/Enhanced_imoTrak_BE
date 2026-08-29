import type { position_accesses } from '../types/access';

/** Full org-leader-style access without organization module permissions. */
export function buildAssetsServicesApproverAccess(): position_accesses {
  const fullReservations = {
    create: true,
    view: true,
    update: true,
    delete: true,
    cancel: true,
    approve: true,
    assignVehicle: true,
    odometerFuel: true,
    start: true,
    complete: true,
    viewOwn: true,
    viewAssigned: true,
    updateReason: true,
  };

  return {
    organizations: { create: false, view: false, update: false, delete: false },
    units: { create: true, view: true, update: true, delete: true },
    positions: { create: true, view: true, update: true, delete: true, assignUser: true },
    users: { create: true, view: true, update: true, delete: true },
    vehicleModels: { create: true, view: true, viewSingle: true, update: true, delete: true },
    vehicles: { create: true, view: true, viewSingle: true, update: true, delete: true },
    reservations: fullReservations,
    vehicleIssues: { report: true, view: true, update: true, delete: true },
    // Section II of the fuel form is theirs. Funding is Finance's and
    // issuing is the logistics desk's, so neither is granted here.
    fuel: {
      request: true,
      view: true,
      viewOwn: true,
      recommend: true,
      confirmFunding: false,
      issue: false,
      receive: true,
      replenish: false,
      viewReport: true,
      manageGenerators: true,
    },
  };
}

/**
 * Every permission the system knows about, switched off.
 *
 * This is what a new account gets. Signing in proves who someone is; it does
 * not decide what they may do. Until an administrator grants something on their
 * position, every protected feature refuses them.
 *
 * It replaces a template that granted reservations, issue reporting and three
 * fuel permissions — including signing for fuel received — to anyone who
 * completed an SSO sign-in, with no administrator involved. That was the direct
 * cause of people seeing features nobody had given them.
 */
export function buildNoAccess(): position_accesses {
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
    vehicleIssues: { report: false, view: false, update: false, delete: false },
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

/** Minimal access granted immediately after first Inuma sign-in. */
export function buildLimitedInumaSignInAccess(): position_accesses {
  return buildNoAccess();
}

/**
 * The position an ordinary Inuma user lands in on first sign-in.
 *
 * Signing in through Inuma is still the registration — the person becomes a
 * member of their campus unit straight away — but membership no longer carries
 * permissions. It used to grant reservations, issue reporting and three fuel
 * permissions immediately, which meant people held access nobody had decided to
 * give them. Everything is now closed until an administrator opens it on the
 * position.
 *
 * Kept as a named function rather than folded into `buildNoAccess` so the two
 * callers reading "what does a new Inuma user get?" still have somewhere
 * obvious to look.
 */
export function buildStandardInumaUserAccess(
  usesReservations = true
): position_accesses {
  // Deliberately unused: the template no longer varies by whether the
  // organization runs reservations, because it no longer grants any.
  void usesReservations;

  return buildNoAccess();
}

/**
 * Whether a position still carries the old sign-in-limited template verbatim —
 * everything closed except seeing one's own reservations.
 *
 * Retained for the historical shape only: new positions are created fully
 * closed, so nothing produces this pattern any more. It no longer gates any
 * rewrite — an existing position's permissions are never overwritten.
 *
 * Used to tell "nobody has ever configured this position" apart from "an
 * administrator deliberately set it this way", so an upgrade never overwrites
 * someone's decision. Compared flag by flag rather than by deep equality,
 * because the stored JSON's key order is not guaranteed and the shape grows
 * over time.
 */
export function isLimitedInumaSignInAccess(access: unknown): boolean {
  if (!access || typeof access !== 'object') return false;

  const granted: string[] = [];
  const walk = (value: unknown, path: string) => {
    if (typeof value === 'boolean') {
      if (value) granted.push(path);
      return;
    }
    if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        walk(child, path ? `${path}.${key}` : key);
      }
    }
  };
  walk(access, '');

  return granted.length === 1 && granted[0] === 'reservations.viewOwn';
}
