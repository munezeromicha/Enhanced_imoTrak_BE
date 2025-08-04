import { Request, Response, NextFunction } from 'express';
import { createUserService, getSingleUserWithPositionsService, getUsersWithPositionsService, unVerfiedUserServices, updateUserService } from '../services/user.services';
import { AppError } from '../utils/Error';
import { position_accesses } from '../types/access';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_access: position_accesses
    organization_id: string;
  };
}

type UnverifiedUser = {
  user_id: string;
  first_name: string;
  last_name: string;
  user_gender: string;
  user_phone: string;
  auth: {
    email: string;
    is_verified: boolean;
  };
  positions: {
    position_id: string;
    position_name: string;
    position_description: string;
    position_status: string;
    unit: {
      unit_id: string;
      unit_name: string;
      organization: {
        organization_id: string;
        organization_name: string;
        organization_email: string;
        organization_phone: string;
      };
    };
  }[];
};

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

export const getUsersWithPositionsController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access.users.view) {
      throw new AppError('You do not have permission to view users', 403);
    }

    const adminAccess = req.user?.position_access.organizations.create;
    const organization_id = req.user.organization_id;

    if (!organization_id) {
      throw new AppError('Organization ID not found in user token', 400);
    }

    const result = await getUsersWithPositionsService(adminAccess ? undefined : organization_id);

    res.status(200).json({ 
      message:"User retrieved successfully",
      data: result 
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleUserWithPositionsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access.users.view) {
      throw new AppError('You do not have permission to view users', 403);
    }

    const { user_id } = req.params;

    const result = await getSingleUserWithPositionsService(user_id);

    res.status(200).json({
      message: 'User retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access.users.update) {
      throw new AppError('You do not have permission to update users', 403);
    }

    const { user_id } = req.params;
    const org_id = req.user.organization_id;
    const hasGlobalAccess = req.user.position_access.organizations.create;

    const result = await updateUserService(user_id, req.body, org_id, hasGlobalAccess);

    res.status(200).json({
      message: 'User updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const unVerfiedUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access.users.view) {
      throw new AppError('You do not have permission to view users', 403);
    }

    const { organization_id } = req.params;

    const [user] = await unVerfiedUserServices(organization_id) as UnverifiedUser[];

    if (!organization_id) {
      throw new AppError('Organization has to be specified', 404);
    }

    if (user.auth.is_verified) {
      throw new AppError('User is already verified', 400);
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
