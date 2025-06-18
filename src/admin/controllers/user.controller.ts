import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import generateStrongPassword from '../../../utils/password'
import { hashPassword } from '../../../utils/hash';
import { AppError } from '../../../utils/Error'
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const UserController = {
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
      const password = generateStrongPassword();
      req.body.password_hash = await hashPassword(password);
      const newUser = await UserService.create(req.body, password);
      
      res.status(201).json(newUser);
    } catch (error: any) {

      if (error.code === 'P2002') {
        const fields = error.meta?.target || [];
        return next(new AppError(`${fields.join(',')} has to be unique`, 409));
      }

      if (error.code === 'P2003') 
        return next( new AppError(`Organisation or role doesn't exists`, 400))
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
