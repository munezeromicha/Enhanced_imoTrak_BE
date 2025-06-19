import { NextFunction, Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { AppError } from '../../../utils/Error';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

const VALID_VEHICLE_STATUSES = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_SERVICE'] as const;
type VehicleStatus = typeof VALID_VEHICLE_STATUSES[number];

export const VehicleController = {
  // Get all vehicles
  getAllVehicles: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const vehicles = await VehicleService.getVehicles(req.user!.id);
      res.json(vehicles);
    } catch (error: any) {
      return next(error);
    }
  },

  // Get vehicle by ID
  getVehicleById: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const vehicle = await VehicleService.getById(req.params.id, req.user!.id);
      if (!vehicle) {
        throw new AppError('Vehicle not found', 404);
      }
      res.json(vehicle);
    } catch (error: any) {
      return next(error);
    }
  },

  // Create new vehicle
  createVehicle: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validate required fields
      const requiredFields = ['plate_number', 'vehicle_type', 'vehicle_model', 'odometer', 'status'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate plate number format (basic validation)
      const plateNumberRegex = /^[A-Z0-9\s-]+$/i;
      if (!plateNumberRegex.test(req.body.plate_number)) {
        return next(new AppError('Invalid plate number format', 400));
      }

      // Validate vehicle status
      if (!VALID_VEHICLE_STATUSES.includes(req.body.status)) {
        return next(new AppError('Invalid vehicle status', 400));
      }

      // Validate year
      const currentYear = new Date().getFullYear();
      if (req.body.year < 1900 || req.body.year > currentYear + 1) {
        return next(new AppError('Invalid vehicle year', 400));
      }

      // Validate odometer
      if (req.body.odometer < 0) {
        return next(new AppError('Odometer cannot be negative', 400));
      }

      // Validate capacity if provided
      if (req.body.capacity !== undefined && req.body.capacity <= 0) {
        return next(new AppError('Capacity must be positive', 400));
      }

      const newVehicle = await VehicleService.createVehicle(req.body, req.user!.id);
      
      res.status(201).json({
        message: 'Vehicle created successfully',
        vehicle: newVehicle
      });
    } catch (error: any) {
      console.error('Vehicle creation error:', error);

      if (error.code === 'P2002') {
        const fields = error.meta?.target || [];
        return next(new AppError(`${fields.join(',')} has to be unique`, 409));
      }

      if (error.code === 'P2003') {
        return next(new AppError(`Invalid foreign key reference`, 400));
      }

      // Handle AppError instances
      if (error instanceof AppError) {
        return next(error);
      }

      // Handle any other unexpected errors
      return next(new AppError('Failed to create vehicle', 500));
    }
  },

  // Update vehicle
  updateVehicle: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validate plate number format if provided
      if (req.body.plate_number) {
        const plateNumberRegex = /^[A-Z0-9\s-]+$/i;
        if (!plateNumberRegex.test(req.body.plate_number)) {
          return next(new AppError('Invalid plate number format', 400));
        }
      }

      // Validate vehicle status if provided
      if (req.body.status && !VALID_VEHICLE_STATUSES.includes(req.body.status)) {
        return next(new AppError('Invalid vehicle status', 400));
      }

      // Validate year if provided
      if (req.body.year !== undefined) {
        const currentYear = new Date().getFullYear();
        if (req.body.year < 1900 || req.body.year > currentYear + 1) {
          return next(new AppError('Invalid vehicle year', 400));
        }
      }

      // Validate odometer if provided
      if (req.body.odometer !== undefined && req.body.odometer < 0) {
        return next(new AppError('Odometer cannot be negative', 400));
      }

      // Validate capacity if provided
      if (req.body.capacity !== undefined && req.body.capacity <= 0) {
        return next(new AppError('Capacity must be positive', 400));
      }

      const updatedVehicle = await VehicleService.updateVehicle(req.params.id, req.body, req.user!.id);
      
      res.json({
        message: 'Vehicle updated successfully',
        vehicle: updatedVehicle
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const fields = error.meta?.target || [];
        return next(new AppError(`${fields.join(', ')} must be unique`, 409));
      }

      if (error.code === 'P2025') {
        return next(new AppError(`Vehicle not found`, 404));
      }

      if (error.code === 'P2003') {
        return next(new AppError(`Invalid foreign key reference`, 400));
      }

      return next(error);
    }
  },

  // Delete vehicle
  deleteVehicle: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await VehicleService.deleteVehicle(req.params.id, req.user!.id);
      res.status(204).send();
    } catch (error: any) {
      return next(error);
    }
  },

  // Get vehicle status options
  getVehicleStatuses: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const statuses = VehicleService.getVehicleStatuses();
      res.json(statuses);
    } catch (error: any) {
      return next(error);
    }
  }
}; 