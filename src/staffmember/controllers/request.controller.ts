import { NextFunction, Request, Response } from 'express';
import { RequestService } from '../services/request.service';
import { AppError } from '../../../utils/Error';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const RequestController = {
  // Get all requests for the staff member
  getMyRequests: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const requests = await RequestService.getMyRequests(req.user!.id);
      res.json(requests);
    } catch (error: any) {
      return next(error);
    }
  },

  // Get request by ID
  getRequestById: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const request = await RequestService.getRequestById(req.params.id, req.user!.id);
      if (!request) {
        throw new AppError('Request not found', 404);
      }
      res.json(request);
    } catch (error: any) {
      return next(error);
    }
  },

  // Get available vehicles
  getAvailableVehicles: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const vehicles = await RequestService.getAvailableVehicles(req.user!.id);
      res.json(vehicles);
    } catch (error: any) {
      return next(error);
    }
  },

  // Create new request
  createRequest: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validate required fields
      const requiredFields = ['trip_purpose', 'start_location', 'end_location', 'start_date', 'end_date', 'full_name'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate passengers number
      if (req.body.passengers_number !== undefined && req.body.passengers_number < 1) {
        return next(new AppError('Passengers number must be at least 1', 400));
      }

      // Validate dates
      const startDate = new Date(req.body.start_date);
      const endDate = new Date(req.body.end_date);
      const now = new Date();

      if (startDate < now) {
        return next(new AppError('Start date cannot be in the past', 400));
      }

      if (endDate <= startDate) {
        return next(new AppError('End date must be after start date', 400));
      }

      const newRequest = await RequestService.createRequest(req.body, req.user!.id);
      
      res.status(201).json({
        message: 'Request created successfully',
        request: newRequest
      });
    } catch (error: any) {
      console.error('Request creation error:', error);

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
      return next(new AppError('Failed to create request', 500));
    }
  },

  // Update request
  updateRequest: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validate passengers number if provided
      if (req.body.passengers_number !== undefined && req.body.passengers_number < 1) {
        return next(new AppError('Passengers number must be at least 1', 400));
      }

      // Validate dates if provided
      if (req.body.start_date || req.body.end_date) {
        const startDate = req.body.start_date ? new Date(req.body.start_date) : new Date();
        const endDate = req.body.end_date ? new Date(req.body.end_date) : new Date();
        const now = new Date();

        if (startDate < now) {
          return next(new AppError('Start date cannot be in the past', 400));
        }

        if (endDate <= startDate) {
          return next(new AppError('End date must be after start date', 400));
        }
      }

      const updatedRequest = await RequestService.updateRequest(req.params.id, req.body, req.user!.id);
      
      res.json({
        message: 'Request updated successfully',
        request: updatedRequest
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const fields = error.meta?.target || [];
        return next(new AppError(`${fields.join(', ')} must be unique`, 409));
      }

      if (error.code === 'P2025') {
        return next(new AppError(`Request not found`, 404));
      }

      if (error.code === 'P2003') {
        return next(new AppError(`Invalid foreign key reference`, 400));
      }

      return next(error);
    }
  },

  // Cancel request
  cancelRequest: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await RequestService.cancelRequest(req.params.id, req.user!.id);
      res.json({
        message: 'Request cancelled successfully'
      });
    } catch (error: any) {
      return next(error);
    }
  }
}; 