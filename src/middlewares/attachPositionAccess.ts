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
    unit_id?: string | null;
    inuma_position?: string | null;
    inuma_unit?: string | null;
    matched_unit_id?: string | null;
    is_sso_user?: boolean;
  };
}

async function fetchPositionWithRetry(positionId: string, retries = 2, delayMs = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await prisma.tbl_position.findUnique({
        where: { position_id: positionId },
        select: { position_access: true, unit_id: true },
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

/**
 * Inuma campus context for the signed-in user. Fetched alongside the position
 * so every controller can scope its query without its own round trip. A failure
 * here must not break the request — the session simply has no campus, which the
 * scope resolver treats as "no campus-specific widening".
 */
async function fetchInumaContext(userId: string) {
  try {
    return await prisma.tbl_auth.findFirst({
      where: { user: { user_id: userId } },
      select: {
        sso_sub: true,
        inuma_position: true,
        inuma_unit: true,
        matched_unit_id: true,
      },
    });
  } catch (error) {
    console.warn('Inuma context lookup skipped:', (error as Error).message);
    return null;
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

    const [position, inuma] = await Promise.all([
      fetchPositionWithRetry(req.user.position_id),
      fetchInumaContext(req.user.user_id),
    ]);

    if (!position) {
      throw new AppError('Position not found', 404);
    }

    req.user.position_access = position.position_access;
    req.user.unit_id = position.unit_id;
    req.user.inuma_position = inuma?.inuma_position ?? null;
    req.user.inuma_unit = inuma?.inuma_unit ?? null;
    req.user.matched_unit_id = inuma?.matched_unit_id ?? null;
    req.user.is_sso_user = !!inuma?.sso_sub;

    next();
  } catch (error) {
    next(error);
  }
};
