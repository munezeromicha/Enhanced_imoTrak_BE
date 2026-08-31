import { Request } from 'express';

export interface position_accesses {
  organizations: {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
  };
  units: {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
  };
  positions: {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
    assignUser: boolean;
  };
  users: {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
  };
  vehicleModels: {
    create: boolean;
    view: boolean;
    viewSingle: boolean;
    update: boolean;
    delete: boolean;
  };
  vehicles: {
    create: boolean;
    view: boolean;
    viewSingle: boolean;
    update: boolean;
    delete: boolean;
  };
  reservations: {
    create: boolean;
    view: boolean; 
    update: boolean; 
    delete: boolean;
    cancel: boolean; 
    approve: boolean; 
    assignVehicle: boolean; 
    odometerFuel: boolean; 
    start: boolean; 
    complete: boolean; 
    viewOwn: boolean;
    viewAssigned: boolean;
    updateReason: boolean;
  };
  vehicleIssues: {
    report: boolean;
    view: boolean;
    viewOwn: boolean;
    update: boolean;
    delete: boolean;
  };
  /**
   * Fuel management. Each flag matches one section of the paper
   * requisition form, so a position can be given exactly the step its
   * holder is responsible for and nothing else.
   *
   * Optional because positions created before this module exists have no
   * `fuel` key in their stored JSON — absent reads as "no access".
   */
  fuel?: {
    /** I. Raise a requisition (driver / generator custodian). */
    request: boolean;
    /** See every requisition in scope. */
    view: boolean;
    /** See only requisitions you raised yourself. */
    viewOwn: boolean;
    /** II. Recommending authority — Assets and Services Management. */
    recommend: boolean;
    /** III. Confirmation of funding — Director of Finance. */
    confirmFunding: boolean;
    /** IV. Verification — Logistics Officer issues the fuel. */
    issue: boolean;
    /** Sign for fuel received. */
    receive: boolean;
    /** Add money to the fuel account. */
    replenish: boolean;
    /** Read the consumption report and account balance. */
    viewReport: boolean;
    /** Register and maintain generators. */
    manageGenerators: boolean;
  };
  /**
   * Archive of organizations, units and positions. Hub SuperAdmins always
   * hold the full set (applied at auth time). Everyone else is granted
   * flags explicitly, and listed items stay inside their tenant/unit.
   */
  archive?: {
    /** Open the Archive page. Implied when any entity flag is on. */
    view: boolean;
    restore: boolean;
    delete: boolean;
    organizations: boolean;
    units: boolean;
    positions: boolean;
  };
}

export interface AuthenticatedUser {
  user_id: string;
  email: string;
  organization_id: string;
  position_id: string;
  position_access?: PositionAccess;
  /** Attached by attachPositionAccess — see utils/campusScope. */
  unit_id?: string | null;
  inuma_position?: string | null;
  inuma_unit?: string | null;
  matched_unit_id?: string | null;
  is_sso_user?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}