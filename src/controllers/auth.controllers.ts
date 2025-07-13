// auth.controllers.ts
import { Request, Response, NextFunction } from 'express';
import { loginUser } from '../services/auth.services';
import { loginSchema } from '../schemas/auth.schema';
import { AppError } from '../utils/Error';

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new AppError('Invalid input', 400);
    }

    const { email, password } = parseResult.data;

    const result = await loginUser(email, password);

    res.status(200).json({      
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
}
