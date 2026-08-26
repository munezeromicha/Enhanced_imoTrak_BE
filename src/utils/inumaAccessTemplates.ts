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

/** Minimal access granted immediately after first Inuma sign-in. */
export function buildLimitedInumaSignInAccess(): position_accesses {
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
      viewOwn: true,
      viewAssigned: false,
      updateReason: false,
    },
    vehicleIssues: { report: false, view: false, update: false, delete: false },
    // Written out even though every flag is closed. A module left absent reads
    // as "not granted" to the clamp but as "unknown" to the permission editor,
    // and that gap is what made fuel impossible to delegate once before.
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
 * Access granted to an ordinary Inuma user the moment they sign in.
 *
 * Signing in through Inuma is the registration: the person is a member of
 * their campus unit straight away, with what a staff member actually needs —
 * request a vehicle, follow and cancel their own requests, report a problem
 * with one. Everything administrative stays closed; widening it is a
 * deliberate act by an administrator on that position.
 */
export function buildStandardInumaUserAccess(
  usesReservations = true
): position_accesses {
  return {
    organizations: { create: false, view: false, update: false, delete: false },
    units: { create: false, view: false, update: false, delete: false },
    positions: { create: false, view: false, update: false, delete: false, assignUser: false },
    users: { create: false, view: false, update: false, delete: false },
    vehicleModels: { create: false, view: false, viewSingle: false, update: false, delete: false },
    vehicles: { create: false, view: false, viewSingle: false, update: false, delete: false },
    reservations: {
      create: usesReservations,
      view: false,
      update: false,
      delete: false,
      cancel: usesReservations,
      approve: false,
      assignVehicle: false,
      odometerFuel: false,
      start: false,
      complete: false,
      viewOwn: usesReservations,
      viewAssigned: false,
      updateReason: usesReservations,
    },
    vehicleIssues: { report: true, view: false, update: false, delete: false },
    // A driver raises their own requisition and signs for what they
    // collect. Every approving signature stays closed.
    fuel: {
      request: true,
      view: false,
      viewOwn: true,
      recommend: false,
      confirmFunding: false,
      issue: false,
      receive: true,
      replenish: false,
      viewReport: false,
      manageGenerators: false,
    },
  };
}

/**
 * Whether a position still carries the old sign-in-limited template verbatim —
 * everything closed except seeing one's own reservations.
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
