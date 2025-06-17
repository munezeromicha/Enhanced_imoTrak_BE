import { login, systemRoles } from './auth.service';
import { NextFunction, Request, Response } from 'express';

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await login(req.body);
    res.json( token );
  } catch (err: any) {
    return next(err)
  }
};
export const showRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await systemRoles();
    res.json( roles );
  } catch (err: any) {
    return next(err)
  }
};
