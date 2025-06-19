import { NextFunction, Request, Response } from 'express';
import { HRService } from '../services/hr.service';
import generateStrongPassword from '../../../utils/password';
import { hashPassword } from '../../../utils/hash';
import { AppError } from '../../../utils/Error';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const HRController = {
  // Get available roles for HR to assign
  getAvailableRoles: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const roles = await HRService.getAvailableRoles();
      res.json(roles);
    } catch (error: any) {
      return next(error);
    }
  },

  // Get all users (staff and fleet managers) created by HR
  getAllUsers: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const users = await HRService.getUsers(req.user!.id);
      res.json(users);
    } catch (error: any) {
      return next(error);
    }
  },

  // Get user by ID
  getUserById: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await HRService.getById(req.params.id, req.user!.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.json(user);
    } catch (error: any) {
      return next(error);
    }
  },

  // Create new user (staff or fleet manager)
  createUser: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'nid', 'gender', 'dob', 'streetAddress', 'roleId'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return next(new AppError('Invalid email format', 400));
      }

      // Validate gender
      if (!['MALE', 'FEMALE'].includes(req.body.gender.toUpperCase())) {
        return next(new AppError('Gender must be either MALE or FEMALE', 400));
      }

      // Generate 8-character password (minimum required by the utility)
      const password = generateStrongPassword(8);
      req.body.password_hash = await hashPassword(password);
      req.body.gender = req.body.gender.toUpperCase();

      const newUser = await HRService.createUser(req.body, password, req.user!.id);
      
      res.status(201).json({
        message: 'User created successfully',
        user: newUser,
        temporaryPassword: password
      });
    } catch (error: any) {
      console.error('User creation error:', error);

      if (error.code === 'P2002') {
        const fields = error.meta?.target || [];
        return next(new AppError(`${fields.join(',')} has to be unique`, 409));
      }

      if (error.code === 'P2003') {
        return next(new AppError(`Role doesn't exist`, 400));
      }

      // Handle AppError instances
      if (error instanceof AppError) {
        return next(error);
      }

      // Handle any other unexpected errors
      return next(new AppError('Failed to create user', 500));
    }
  },

  // Update user
  updateUser: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validate email format if provided
      if (req.body.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
          return next(new AppError('Invalid email format', 400));
        }
      }

      // Validate gender if provided
      if (req.body.gender && !['MALE', 'FEMALE'].includes(req.body.gender.toUpperCase())) {
        return next(new AppError('Gender must be either MALE or FEMALE', 400));
      }

      if (req.body.gender) {
        req.body.gender = req.body.gender.toUpperCase();
      }

      const updatedUser = await HRService.updateUser(req.params.id, req.body, req.user!.id);
      
      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const fields = error.meta?.target || [];
        return next(new AppError(`${fields.join(', ')} must be unique`, 409));
      }

      if (error.code === 'P2025') {
        return next(new AppError(`User not found`, 404));
      }

      if (error.code === 'P2003') {
        return next(new AppError(`Invalid foreign key reference`, 400));
      }

      return next(error);
    }
  },

  // Delete user
  deleteUser: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await HRService.deleteUser(req.params.id, req.user!.id);
      res.status(204).send();
    } catch (error: any) {
      return next(error);
    }
  }
}; 