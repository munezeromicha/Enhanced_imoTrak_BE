import { Request, Response, NextFunction } from 'express';
import { createUserService, getUsersGroupedByUnitsService } from '../services/use.services';
import { AppError } from '../utils/Error';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_access: {
      organizations: { create: boolean };
      users: { create: boolean };
    };
    organization_id: string;
  };
}

export const createUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access.users.create) {
      throw new AppError('You do not have permission to create users', 403);
    }

    const {
      first_name,
      last_name,
      user_nid,
      user_phone,
      user_gender,
      user_dob,
      street_address,
      position_id,
      email,
    } = req.body;

    const user = await createUserService({
      first_name,
      last_name,
      user_nid,
      user_phone,
      user_gender,
      user_dob,
      street_address,
      position_id,
      email,
      requester_org_id: req.user.organization_id,
      hasOrgCreateAccess: req.user.position_access.organizations.create,
    });

    res.status(201).json({
      message: 'User created successfully',
      data: user,
    });
  } catch (error: any) {
    // Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return next(new AppError(`User with this ${field} already exists`, 409));
    }
    if (error.message === 'Position not found or inactive' || error.message === 'Position does not belong to your organization') {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
};

export const getUsersGroupedByUnitsController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access.users.view) {
      throw new AppError('You do not have permission to view users', 403);
    }

    const result = await getUsersGroupedByUnitsService(req.user.organization_id);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
