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
  };
  users: {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
  };
}