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
    updateReason: boolean;
  };
  vehicleIssues: {
    report: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
  };
}

export interface AuthenticatedUser {
  user_id: string;
  email: string;
  organization_id: string;
  position_id: string;
  position_access?: PositionAccess;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}