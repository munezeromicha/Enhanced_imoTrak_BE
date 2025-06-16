import { login } from './auth.service';
import { NextFunction, Request, Response } from 'express';

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await login(req.body);
    res.json( token );
  } catch (err: any) {
    return next(err)
  }
};
