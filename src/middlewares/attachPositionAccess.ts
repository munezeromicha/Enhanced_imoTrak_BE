// middleware/attachPositionAccess.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
    position_access?: any;
  };
}

async function fetchPositionWithRetry(positionId: string, retries = 2, delayMs = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await prisma.tbl_position.findUnique({
        where: { position_id: positionId },
        select: { position_access: true },
      });
    } catch (err: any) {
      if (attempt < retries && err?.code === 'P1001') {
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }
      throw err;
    }
  }
}

export const attachPositionAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_id) {
      throw new AppError('Position ID missing in token payload', 403);
    }

    const position = await fetchPositionWithRetry(req.user.position_id);

    if (!position) {
      throw new AppError('Position not found', 404);
    }

    req.user.position_access = position.position_access;
    next();
  } catch (error) {
    next(error);
  }
};
