// auth.controllers.ts
import { Request, Response, NextFunction } from 'express';
import { loginUser, loginWithPosition, logoutUser } from '../services/auth.services';
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

export async function loginWithPositionController(req: Request, res: Response, next: NextFunction) {
  try {
    const { position_id } = req.params;
    if (!position_id) throw new AppError('Missing position_id in path', 400);

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Invalid input format', 400);
    }

    const { email, password } = parsed.data;

    const result = await loginWithPosition(email, password, position_id);

    res.status(200).json({
      message: 'Sign in successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('Logout endpoint hit. Headers:', req.headers);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted token:', token);

    if (!token) {
      throw new AppError('Access token required', 401);
    }

    await logoutUser(token);

    res.status(200).json({
      message: 'Logout successful',
      data: null
    });
  } catch (error) {
    next(error);
  }
}