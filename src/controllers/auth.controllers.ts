import { Request, Response, NextFunction } from 'express';
import { forgotPasswordService, loginUser, loginWithPosition, logoutUser, resendInvitationService, setPasswordAndVerifyService, updatePasswordService, verifyUserByEmailService } from '../services/auth.services';
import { loginSchema } from '../schemas/auth.schema';
import { AppError } from '../utils/Error';
import { position_accesses } from '../types/access';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
    organization_id: string;
    position_access?: position_accesses;
  };
}


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
    const ip = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await logoutUser(token, { ip, userAgent });

    res.status(200).json({
      message: 'Logout successful',
      data: null
    });
  } catch (error) {
    next(error);
  }
}

export const updatePasswordController = async ( req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updates = await updatePasswordService({email: req.user?.email, ...req.body});
    return res.status(200).json({
      message: 'Password updated successfully',
      data: updates
    });
  } catch(error) {
    next(error)
  }
}

export const forgotPasswordController = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    await forgotPasswordService(req.body.email);
    return res.status(200).json({
      message: 'Password reset successful',
      data: {email: req.body.email}
    });
  } catch (error) {
    next(error)
  }
};

export async function verifyUserByEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.params;
    const { token } = req.query;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    if (!token || typeof token !== 'string') {
      throw new AppError('Token is required and must be a string', 400);
    }

    const data = await verifyUserByEmailService(email, token);

    res.status(200).json({
      message: 'User verified successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

export async function setPasswordAndVerifyController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { password } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const email = req.user?.email;

    // Validation
    if (!email || typeof email !== 'string') {
      throw new AppError('Email is required and must be a string', 400);
    }

    if (!password || typeof password !== 'string') {
      throw new AppError('Password is required and must be a string', 400);
    }

    if (!token || typeof token !== 'string') {
      throw new AppError('Token is required and must be a string', 400);
    }

    const result = await setPasswordAndVerifyService(email, password, token);

    res.status(200).json({
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function resendInvitationController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const result = await resendInvitationService(email);

    res.status(200).json({
      message: 'Invitation link resent successfully',
      data: result,});
  } catch (error) {
    next(error);
  }
}