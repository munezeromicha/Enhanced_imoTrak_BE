import { Request, Response } from 'express';
import getAuditLogs from '../services/auditService';


export async function fetchAuditLogs(req: Request, res: Response) {
  try {
    const { name, email, organization, startDate, endDate, page, limit } = req.query;

    const result = await getAuditLogs({
      name: name ? String(name) : undefined,
      email: email ? String(email) : undefined,
      organization: organization ? String(organization) : undefined,
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
