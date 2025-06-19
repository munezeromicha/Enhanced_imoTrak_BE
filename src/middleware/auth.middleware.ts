import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../utils/Error';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    if (typeof decoded === 'object' && decoded.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden. Admin access required.' });
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authenticateHR = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    if (typeof decoded === 'object' && decoded.role !== 'hr') {
      res.status(403).json({ error: 'Forbidden. HR access required.' });
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authenticateFleetManager = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    if (typeof decoded === 'object' && decoded.role !== 'fleetmanager') {
      res.status(403).json({ error: 'Forbidden. Fleet manager access required.' });
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authenticateStaff = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Get user with role information
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      include: {
        roles: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if user is active
    if (user.status !== 'active') {
      res.status(403).json({ error: 'Account is not active' });
      return;
    }

    // Check if user has staff role
    if (user.roles.name !== 'staff') {
      res.status(403).json({ error: 'Access denied. Only staff members can access this resource' });
      return;
    }

    // Add user information to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.roles.name,
      organization_id: user.organization_id
    };

    next();
  } catch (error: any) {
    console.error('Staff middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};