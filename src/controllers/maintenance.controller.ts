import { NextFunction, Request, Response } from 'express';
import * as maintenanceService from '../services/maintenance.service';
import { position_accesses } from '../types/access';
import { AppError } from '../utils/Error';
import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
  completeMaintenanceSchema,
  cancelMaintenanceSchema,
  assignSupervisorSchema,
} from '../schemas/maintenance.schema';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
    organization_id: string;
    position_access: position_accesses;
  };
}

/**
 * Maintenance reuses the vehicleIssues permission set so every existing
 * position works without a position_access backfill.
 */
function requireView(req: AuthenticatedRequest) {
  if (!req.user?.position_access?.vehicleIssues?.view) {
    throw new AppError('Access denied. You are not allowed to view maintenance records.', 403);
  }
  return req.user;
}

function requireManage(req: AuthenticatedRequest, action: 'update' | 'report' | 'delete') {
  if (!req.user?.position_access?.vehicleIssues?.[action]) {
    throw new AppError('Access denied. You are not allowed to manage maintenance records.', 403);
  }
  return req.user;
}

export const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireView(req);
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const records = await maintenanceService.getAllMaintenance(user, status);
    res.status(200).json({ message: 'Maintenance records retrieved successfully.', data: records });
  } catch (err) {
    next(err);
  }
};

export const getForVehicle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireView(req);
    const records = await maintenanceService.getMaintenanceForVehicle(req.params.vehicleId, user);
    res.status(200).json({ message: 'Maintenance history retrieved successfully.', data: records });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireView(req);
    const record = await maintenanceService.getMaintenanceById(req.params.id, user);
    res.status(200).json({ message: 'Maintenance record retrieved successfully.', data: record });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireManage(req, 'report');
    const input = createMaintenanceSchema.parse(req.body);
    const record = await maintenanceService.createMaintenance(input, user);
    res.status(201).json({ message: 'Maintenance job created successfully.', data: record });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireManage(req, 'update');
    const input = updateMaintenanceSchema.parse(req.body);
    const record = await maintenanceService.updateMaintenance(req.params.id, input, user);
    res.status(200).json({ message: 'Maintenance job updated successfully.', data: record });
  } catch (err) {
    next(err);
  }
};

export const start = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireManage(req, 'update');
    const record = await maintenanceService.startMaintenance(req.params.id, user);
    res.status(200).json({ message: 'Maintenance started. Vehicle marked as MAINTENANCE.', data: record });
  } catch (err) {
    next(err);
  }
};

export const complete = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireManage(req, 'update');
    const input = completeMaintenanceSchema.parse(req.body);
    const record = await maintenanceService.completeMaintenance(req.params.id, input, user);
    res.status(200).json({ message: 'Maintenance completed. Vehicle returned to service.', data: record });
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireManage(req, 'update');
    const input = cancelMaintenanceSchema.parse(req.body);
    const record = await maintenanceService.cancelMaintenance(req.params.id, input, user);
    res.status(200).json({ message: 'Maintenance cancelled.', data: record });
  } catch (err) {
    next(err);
  }
};

export const assignSupervisor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireManage(req, 'update');
    const input = assignSupervisorSchema.parse(req.body);
    const record = await maintenanceService.assignSupervisor(req.params.id, input, user);
    res.status(200).json({ message: 'Maintenance supervisor updated.', data: record });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireManage(req, 'delete');
    await maintenanceService.deleteMaintenance(req.params.id, user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
