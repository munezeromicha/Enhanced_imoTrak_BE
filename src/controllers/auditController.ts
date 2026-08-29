import { Request, Response } from 'express';
import { position_accesses } from '../types/access';
import { getAuditLogs, updateUserService } from '../services/auditService';
import { authOf, type AuthorizedRequest } from '../middlewares/requirePermission';
import { isHubSuperAdmin } from '../utils/authContext';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
    organization_id: string;
    position_access: position_accesses;
  };
}

// Fetch audit logs with filters and pagination
export async function fetchAuditLogs(req: Request, res: Response) {
  try {
    const ctx = authOf(req as AuthorizedRequest);
    const { name, email, organization, startDate, endDate, page, limit } = req.query;

    // The organization is derived from the session, never from the query
    // string. A hub SuperAdmin may narrow to a named tenant; anyone else is
    // pinned to their own regardless of what they send.
    const organizationId = isHubSuperAdmin(ctx)
      ? (organization ? String(organization) : null)
      : ctx.organizationId;

    const result = await getAuditLogs({
      name: name ? String(name) : undefined,
      email: email ? String(email) : undefined,
      organizationId,
      startDate: startDate ? new Date(String(startDate)) : undefined,
      endDate: endDate ? new Date(String(endDate)) : undefined,
      page: page ? parseInt(String(page), 10) : 1,
      limit: limit ? parseInt(String(limit), 10) : 20,
    });

    return res.json({
      success: true,
      data: result.logs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}

// Update user and trigger audit log
export async function createAuditLog(req: AuthenticatedRequest, res: Response) {
  try {
    const actingUserId = req.user?.user_id;
    const { id } = req.params;
    const newData = req.body;

    if (!actingUserId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedUser = await updateUserService({
      id,
      newData,
      actingUserId,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
    });

    return res.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
