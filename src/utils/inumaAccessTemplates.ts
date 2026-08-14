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
  };
}

/** @deprecated Use buildLimitedInumaSignInAccess for new SSO users. */
export function buildDefaultInumaSyncedPositionAccess(): position_accesses {
  return buildLimitedInumaSignInAccess();
}
