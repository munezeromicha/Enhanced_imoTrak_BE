import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import generateStrongPassword from '../../../utils/password'
import { hashPassword } from '../../../utils/hash';
import { AppError } from '../../../utils/Error'
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const UserController = {
  // Health check for user creation
  healthCheck: async (req: Request, res: Response) => {
    res.json({ 
      status: 'User service is healthy',
      timestamp: new Date().toISOString()
    });
  },

  getAll: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.getUsers();
      res.json(users);
    } catch (error: any) {
      return next();
    }
  },

  getById: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) 
        throw new AppError('User not found', 404);
      const {password_hash, last_login, ...resData} = user
      res.json(resData);
    } catch (error: any) {
      return next (error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'nid', 'role', 'gender', 'dob', 'organizationId'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return next(new AppError('Invalid email format', 400));
      }

      const password = generateStrongPassword();
      req.body.password_hash = await hashPassword(password);
      const newUser = await UserService.create(req.body, password);
      const {password_hash, last_login, ...resData} = newUser
      
      res.status(201).json(resData);
    } catch (error: any) {
      console.error('User creation error:', error);

      if (error.code === 'P2002') {
        const fields = error.meta?.target || [];
        return next(new AppError(`${fields.join(',')} has to be unique`, 409));
      }

      if (error.code === 'P2003') {
        return next(new AppError(`Organisation or role doesn't exists`, 400));
      }

      // Handle AppError instances
      if (error instanceof AppError) {
        return next(error);
      }

      // Handle email sending errors
      if (error.message && error.message.includes('Email sending failure')) {
        return next(new AppError('User created but email notification failed', 201));
      }

      // Handle any other unexpected errors
      return next(new AppError('Failed to create user', 500));
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await UserService.update(req.params.id, req.body);
      const { password_hash, last_login,  ...resData} = updatedUser
      res.json(resData);
    } catch (error: any) {
      if (error.code === 'P2002') {
        const fields = error.meta?.target || [];
        return next(new AppError(`${fields.join(', ')} must be unique`, 409));
      }

      if (error.code === 'P2025') {
        return next(new AppError(`User not found`, 404));
      }

      if (error.code === 'P2003') {
        return next(new AppError(`Invalid foreign key reference (e.g. organization or role)`, 400));
      }

      return next(error); // fallback for other unexpected errors
    }
  },


  delete: async (req: Request, res: Response) => {
    await UserService.delete(req.params.id);
    res.status(204).send();
  },
};
