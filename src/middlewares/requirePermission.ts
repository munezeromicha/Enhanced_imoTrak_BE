import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/Error';
import {
  resolveAuthContext,
  has,
  hasAny,
  type AuthContext,
  type RequestUser,
} from '../utils/authContext';

/**
 * Route-level permission enforcement.
 *
 * Authorization used to be written by hand inside each handler, in four
 * different idioms, and two endpoints ended up with no check at all. Declaring
 * the requirement on the route makes the route table the authorization
 * inventory: a missing declaration is visible in review rather than buried.
 *
 * Runs after `authenticateToken` and `attachPositionAccess`, and leaves the
 * resolved context on `req.auth` so handlers scope their queries from the same
 * answer the permission check used.
 */

export interface AuthorizedRequest extends Request {
  user?: RequestUser;
  auth?: AuthContext;
}

type Req = AuthorizedRequest;

/**
 * Attach the authorization context without demanding a permission.
 *
 * For the handful of endpoints every signed-in user may reach — their own
 * profile, their own notifications — which still need scope for their queries.
 */
export function attachAuthContext() {
  return async (req: Req, _res: Response, next: NextFunction) => {
    try {
      if (!req.user?.user_id || !req.user.position_id) {
        throw new AppError('Authentication required', 401);
      }
      req.auth = await resolveAuthContext(req.user);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Require one permission, or any one of several.
 *
 * `requirePermission('vehicles.update')`
 * `requirePermission(['reservations.view', 'reservations.viewOwn'])` — holding
 * either is enough to reach the handler, which then narrows what is returned.
 *
 * Denial is 403 and names the permission, because a silent or vague refusal is
 * what made the original problem so hard to diagnose.
 */
export function requirePermission(permission: string | string[]) {
  const required = Array.isArray(permission) ? permission : [permission];

  return async (req: Req, _res: Response, next: NextFunction) => {
    try {
      if (!req.user?.user_id || !req.user.position_id) {
        throw new AppError('Authentication required', 401);
      }

      const ctx = req.auth ?? (await resolveAuthContext(req.user));
      req.auth = ctx;

      const allowed = required.length === 1 ? has(ctx, required[0]) : hasAny(ctx, required);
      if (!allowed) {
        throw new AppError(
          `Access denied. Your position does not hold ${required.join(' or ')}.`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/** Restricts a route to hub SuperAdmins — organization provisioning and the like. */
export function requireHubSuperAdmin() {
  return async (req: Req, _res: Response, next: NextFunction) => {
    try {
      if (!req.user?.user_id || !req.user.position_id) {
        throw new AppError('Authentication required', 401);
      }
      const ctx = req.auth ?? (await resolveAuthContext(req.user));
      req.auth = ctx;

      if (ctx.privilege !== 'HUB_SUPERADMIN') {
        throw new AppError('Access denied. This action is restricted.', 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * The context a handler runs with.
 *
 * Throws rather than returning undefined: a handler reaching for scope it was
 * never given is a wiring mistake, and failing closed is the point.
 */
export function authOf(req: Req): AuthContext {
  if (!req.auth) {
    throw new AppError('Authorization context missing for this route', 500);
  }
  return req.auth;
}
