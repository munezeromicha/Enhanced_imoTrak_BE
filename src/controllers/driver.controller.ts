import { Response } from 'express';
import { AuthenticatedRequest } from '../types/access';
import * as driverService from '../services/driver.service';
import { createDriverSchema, updateDriverSchema } from '../schemas/driver.schema';
import { AppError } from '../utils/Error';

function checkUserPermission(req: AuthenticatedRequest, action: 'create' | 'view' | 'update' | 'delete') {
  if (!req.user?.position_access?.users?.[action]) {
    throw new AppError(`Forbidden: insufficient user management permissions to ${action} drivers`, 403);
  }
}

export const createDriver = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkUserPermission(req, 'create');
    const body = createDriverSchema.parse(req.body);
    const driver = await driverService.createDriver(body);
    res.status(201).json({
      message: 'Driver profile created successfully',
      data: driver,
    });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 400;
    res.status(status).json({ message: error.message || 'Unknown error' });
  }
};

export const updateDriver = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkUserPermission(req, 'update');
    const driverId = req.params.id;
    const body = updateDriverSchema.parse(req.body);
    const driver = await driverService.updateDriver(driverId, body);
    res.status(200).json({
      message: 'Driver profile updated successfully',
      data: driver,
    });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 400;
    res.status(status).json({ message: error.message || 'Unknown error' });
  }
};

export const getDriverById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkUserPermission(req, 'view');
    const driverId = req.params.id;
    const driver = await driverService.getDriverById(driverId);
    res.status(200).json({
      message: 'Driver retrieved successfully',
      data: driver,
    });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 400;
    res.status(status).json({ message: error.message || 'Unknown error' });
  }
};

export const getSelfDriverProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.user_id;
    const driver = await driverService.getDriverByUserId(userId);
    if (!driver) {
      return res.status(404).json({ message: 'No driver profile associated with this user account' });
    }
    res.status(200).json({
      message: 'Driver profile retrieved successfully',
      data: driver,
    });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 400;
    res.status(status).json({ message: error.message || 'Unknown error' });
  }
};

export const getAllDrivers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkUserPermission(req, 'view');
    const organizationId = req.user.organization_id;
    const drivers = await driverService.getAllDrivers(organizationId);
    res.status(200).json({
      message: 'Drivers retrieved successfully',
      data: drivers,
    });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 400;
    res.status(status).json({ message: error.message || 'Unknown error' });
  }
};

export const getDriverTripHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const driverId = req.params.id;
    
    // Authorization: User must be able to view users, OR be the driver themselves
    const driver = await driverService.getDriverById(driverId);
    const isSelf = driver.user_id === req.user.user_id;
    if (!isSelf) {
      checkUserPermission(req, 'view');
    }

    const history = await driverService.getDriverTripHistory(driverId);
    res.status(200).json({
      message: 'Driver trip history retrieved successfully',
      data: history,
    });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 400;
    res.status(status).json({ message: error.message || 'Unknown error' });
  }
};

export const getDriverActiveTrip = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const driverId = req.params.id;

    // Authorization: User must be able to view users, OR be the driver themselves
    const driver = await driverService.getDriverById(driverId);
    const isSelf = driver.user_id === req.user.user_id;
    if (!isSelf) {
      checkUserPermission(req, 'view');
    }

    const activeTrip = await driverService.getDriverActiveTrip(driverId);
    res.status(200).json({
      message: 'Driver active trip retrieved successfully',
      data: activeTrip,
    });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 400;
    res.status(status).json({ message: error.message || 'Unknown error' });
  }
};
