import { Request, Response, NextFunction } from 'express';
import { loginUser,loginWithPosition } from '../services/auth.services';
import { loginSchema } from '../schemas/auth.schema';
import { AppError } from '../utils/Error';
import { getRequestMeta } from '../utils/get-meta';

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new AppError('Invalid input', 400);
    }

    const { email, password } = parseResult.data;
    const { ip, userAgent } = getRequestMeta(req);

    const result = await loginUser(email, password, { ip, userAgent });

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
    const { ip, userAgent } = getRequestMeta(req);
    const result = await loginWithPosition(email, password, position_id, { ip, userAgent });

    res.status(200).json({
      message: 'Sign in successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
}
