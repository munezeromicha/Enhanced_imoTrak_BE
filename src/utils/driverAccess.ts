import { AppError } from './Error';

/** Minimal request shape used by controllers with optional `user`. */
export type DriverAccessRequest = {
  user?: {
    position_access?: {
      organizations?: { view?: boolean };
    };
  };
};

/** Hub SuperAdmin (organizations module) must not manage org-scoped drivers. */
export function assertOrganizationDriverManagement(req: DriverAccessRequest) {
  if (req.user?.position_access?.organizations?.view) {
    throw new AppError(
      'Driver management is only available to organization-assigned users, not hub administrators.',
      403
    );
  }
}
