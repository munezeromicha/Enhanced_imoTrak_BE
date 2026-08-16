import { isAuthorizedInumaApproverPosition } from '../constants/inuma';
import type { position_accesses } from '../types/access';
import { AppError } from './Error';

/**
 * Request-scoped identity assembled by `attachPositionAccess`.
 *
 * `unit_id` is the unit owning the position the session was issued for;
 * `matched_unit_id` is the ImoTrak unit resolved from the user's Inuma campus
 * at SSO sign-in. For an Inuma user the two normally agree — `matched_unit_id`
 * wins because it survives a position being moved.
 */
export type RequesterContext = {
  user_id: string;
  organization_id: string;
  position_id?: string;
  unit_id?: string | null;
  inuma_position?: string | null;
  inuma_unit?: string | null;
  matched_unit_id?: string | null;
  is_sso_user?: boolean;
  position_access?: position_accesses;
};

export type CampusScope = {
  /** Hub admin who provisions organizations — sees everything, never campus-bound. */
  isSuperAdmin: boolean;
  /** Holds one of the three Inuma Assets & Services Management positions. */
  isInumaApprover: boolean;
  /** The single unit this requester may read across, or undefined for org-wide. */
  campusUnitId?: string;
  organizationId: string;
};

/**
 * Work out how far a requester can see.
 *
 * Inuma (SSO) users are pinned to the campus they signed in from — including
 * Assets and Services Management administrators, who manage their own campus
 * and no other. Local email/password accounts keep the pre-existing
 * organization-wide behaviour so non-UR tenants are unaffected.
 */
export function resolveCampusScope(user: RequesterContext | undefined): CampusScope {
  const isSuperAdmin = !!user?.position_access?.organizations?.create;
  const isInumaApprover = isAuthorizedInumaApproverPosition(user?.inuma_position);

  const scope: CampusScope = {
    isSuperAdmin,
    isInumaApprover,
    organizationId: user?.organization_id || '',
  };

  if (!user || isSuperAdmin) {
    return scope;
  }

  // Only Inuma-provisioned sessions carry a campus. `is_sso_user` covers users
  // whose campus could not be matched — they stay pinned to their position's
  // unit rather than falling back to the whole organization.
  if (user.is_sso_user || user.matched_unit_id) {
    scope.campusUnitId = user.matched_unit_id || user.unit_id || undefined;
  }

  return scope;
}

/** True when this requester may only read rows belonging to one campus. */
export function isCampusRestricted(scope: CampusScope): boolean {
  return !scope.isSuperAdmin && !!scope.campusUnitId;
}

/**
 * Guards a unit-addressed request. Throws 403 when a campus-bound requester
 * reaches for a unit that is not their own campus.
 */
export function assertUnitInScope(
  user: RequesterContext | undefined,
  unitId: string,
  action = 'access'
): void {
  const scope = resolveCampusScope(user);
  if (!isCampusRestricted(scope)) return;
  if (scope.campusUnitId === unitId) return;

  throw new AppError(`You can only ${action} your own campus.`, 403);
}
