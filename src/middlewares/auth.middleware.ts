import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/Error';
import { setRequestContext } from '../context/request-context';
import { getRequestMeta } from '../utils/get-meta';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) {
      throw new AppError('Access token required', 401);
    }

    // Check if token is blacklisted
    const blacklistedToken = await prisma.tbl_jwt_blacklist.findUnique({
      where: { token }
    });

    if (blacklistedToken) {
      throw new AppError('Token has been revoked', 401);
    }

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded;

    // Extract metadata
    const { ip, userAgent } = getRequestMeta(req);
    const userId = decoded.user_id;

    // Store in async local storage
    setRequestContext({ userId, ip, userAgent });
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token', 401));
    }
  }
}

export async function cleanupExpiredTokens() {
  try {
    const now = new Date();
    await prisma.tbl_jwt_blacklist.deleteMany({
      where: {
        expires_at: {
          lt: now
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
} 
