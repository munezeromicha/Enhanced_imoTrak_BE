import { Request, Response, NextFunction } from 'express';
import { createAuditLog } from '../services/auditService';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
    organization_id: string;
  };
}

// Map route patterns to human-readable action names
const resolveAction = (method: string, path: string): string => {
  const p = path.toLowerCase();

  // Auth
  if (method === 'POST' && p.includes('/auth/') && p.includes('/logout') === false) return 'LOGIN';

  // Vehicles
  if (method === 'POST'   && p.match(/\/vehicles\/[^/]+\/locations/)) return 'VEHICLE_LOCATION_UPDATE';
  if (method === 'POST'   && p.endsWith('/vehicles'))   return 'CREATE_VEHICLE';
  if (method === 'PUT'    && p.match(/\/vehicles\/[^/]+$/)) return 'UPDATE_VEHICLE';
  if (method === 'DELETE' && p.match(/\/vehicles\/[^/]+$/)) return 'DELETE_VEHICLE';

  // Vehicle models
  if (method === 'POST'   && p.endsWith('/vehicle-models'))   return 'CREATE_VEHICLE_MODEL';
  if (method === 'PUT'    && p.includes('/vehicle-models/'))  return 'UPDATE_VEHICLE_MODEL';
  if (method === 'DELETE' && p.includes('/vehicle-models/'))  return 'DELETE_VEHICLE_MODEL';

  // Reservations
  if (method === 'POST'   && p.endsWith('/reservations'))          return 'CREATE_RESERVATION';
  if (method === 'PUT'    && p.includes('/reservations/'))         return 'UPDATE_RESERVATION';
  if (method === 'DELETE' && p.includes('/reservations/'))         return 'DELETE_RESERVATION';
  if (method === 'POST'   && p.includes('/reservations/') && p.includes('/accept'))       return 'ACCEPT_RESERVATION';
  if (method === 'POST'   && p.includes('/reservations/') && p.includes('/approve'))      return 'APPROVE_RESERVATION';
  if (method === 'POST'   && p.includes('/reservations/') && p.includes('/reject'))       return 'REJECT_RESERVATION';
  if (method === 'POST'   && p.includes('/reservations/') && p.includes('/cancel'))       return 'CANCEL_RESERVATION';
  if (method === 'POST'   && p.includes('/reservations/') && p.includes('/start'))        return 'START_RESERVATION';
  if (method === 'POST'   && p.includes('/reservations/') && p.includes('/complete'))     return 'COMPLETE_RESERVATION';
  if (method === 'POST'   && p.includes('/reservations/') && p.includes('/add-vehicle'))  return 'ASSIGN_VEHICLE_TO_RESERVATION';

  // Users
  if (method === 'POST'   && p.endsWith('/users'))        return 'CREATE_USER';
  if (method === 'PUT'    && p.includes('/users/'))       return 'UPDATE_USER';
  if (method === 'DELETE' && p.includes('/users/'))       return 'DELETE_USER';

  // Organizations
  if (method === 'POST'   && p.endsWith('/organizations'))    return 'CREATE_ORGANIZATION';
  if (method === 'PUT'    && p.includes('/organizations/'))   return 'UPDATE_ORGANIZATION';
  if (method === 'DELETE' && p.includes('/organizations/'))   return 'DELETE_ORGANIZATION';

  // Units
  if (method === 'POST'   && p.endsWith('/units'))    return 'CREATE_UNIT';
  if (method === 'PUT'    && p.includes('/units/'))   return 'UPDATE_UNIT';
  if (method === 'DELETE' && p.includes('/units/'))   return 'DELETE_UNIT';

  // Positions
  if (method === 'POST'   && p.endsWith('/positions'))    return 'CREATE_POSITION';
  if (method === 'PUT'    && p.includes('/positions/'))   return 'UPDATE_POSITION';
  if (method === 'DELETE' && p.includes('/positions/'))   return 'DELETE_POSITION';
  if (method === 'POST'   && p.includes('/positions/') && p.includes('/assign')) return 'ASSIGN_USER_TO_POSITION';

  // Vehicle issues
  if (method === 'POST'   && p.includes('/issues'))   return 'REPORT_VEHICLE_ISSUE';
  if (method === 'PUT'    && p.includes('/issues/'))  return 'UPDATE_VEHICLE_ISSUE';
  if (method === 'DELETE' && p.includes('/issues/'))  return 'DELETE_VEHICLE_ISSUE';

  // Fallback
  return `${method} ${path}`;
};

// Extract table name from path
const resolveTable = (path: string): string => {
  const p = path.toLowerCase();
  if (p.includes('/vehicle-models')) return 'tbl_vehicle_models';
  if (p.includes('/vehicles'))       return 'tbl_vehicles';
  if (p.includes('/reservations'))   return 'tbl_reservations';
  if (p.includes('/users'))          return 'tbl_users';
  if (p.includes('/organizations'))  return 'tbl_organizations';
  if (p.includes('/units'))          return 'tbl_unit';
  if (p.includes('/positions'))      return 'tbl_position';
  if (p.includes('/issues'))         return 'tbl_vehicle_issues';
  return 'unknown';
};

// Extract record ID from path (last UUID segment)
const extractRecordId = (path: string): string | undefined => {
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = path.match(uuidRegex);
  return match?.[0];
};

const AUDITABLE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// Routes to skip (no user context or too noisy)
const SKIP_PATHS = [
  '/v2/auth/login',
  '/v2/auth/logout',       // already tracked manually
  '/v2/auth/forgot-password',
  '/v2/auth/resend-invitation',
  '/v2/vehicles/',         // location pings — too noisy
];

export const auditLogger = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!AUDITABLE_METHODS.includes(req.method)) return next();

  const fullPath = req.originalUrl.split('?')[0];

  // Skip noisy or already-tracked routes
  if (SKIP_PATHS.some(skip => fullPath.includes(skip) && skip.endsWith('/'))) return next();
  if (fullPath.includes('/locations')) return next(); // GPS pings — skip

  res.on('finish', async () => {
    // Only log successful mutations (2xx)
    if (res.statusCode < 200 || res.statusCode >= 300) return;

    const userId = req.user?.user_id;
    if (!userId) return; // no user context, skip

    try {
      await createAuditLog({
        action: resolveAction(req.method, fullPath),
        userId,
        table_name: resolveTable(fullPath),
        record_id: extractRecordId(fullPath),
        ip_address: req.ip || req.socket?.remoteAddress || 'unknown',
        user_agent: req.headers['user-agent'] || 'unknown',
      });
    } catch (err) {
      console.error('Audit log error:', err);
    }
  });

  next();
};
