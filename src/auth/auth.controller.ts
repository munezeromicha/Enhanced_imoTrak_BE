import { login, systemRoles } from './auth.service';
import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await login(req.body);
    res.json( token );
  } catch (err: any) {
    return next(err)
  }
};

export const showRoles = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const roles = await systemRoles(req.user.role);
    res.json(roles);
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next(error);
  }
};
