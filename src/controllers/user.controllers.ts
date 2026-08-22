import { Request, Response, NextFunction } from 'express';
import { createUserService, deleteUserPermanentlyService, getSingleUserWithPositionsService, getUnverifiedUsersService, getUsersWithPositionsService, getSingleUnverifiedUserService, updateUserService, updateMyProfileService } from '../services/user.services';
import { AppError } from '../utils/Error';
import { uploadToCloudinary } from '../utils/cloudinary';
import { position_accesses } from '../types/access';
import { resolveCampusScope } from '../utils/campusScope';
import { isOrgLeader, isSuperAdmin } from '../utils/orgLeader';
import { changeUserPositionService, updateMySignatureService } from '../services/user.services';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_access: position_accesses
    organization_id: string;
    position_id: string;
    // Attached by attachPositionAccess — see utils/campusScope.
    unit_id?: string | null;
    inuma_position?: string | null;
    inuma_unit?: string | null;
    matched_unit_id?: string | null;
    is_sso_user?: boolean;
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
      requester_position_access: req.user.position_access,
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
    if (error.message === 'Position not found or inactive' || error.message === 'Position does not belong to your organization' || error.message === 'You cannot assign a position that grants permissions you do not have') {
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

    const scope = resolveCampusScope(req.user);
    const adminAccess = scope.isSuperAdmin;
    const organization_id = req.user.organization_id;

    if (!organization_id) {
      throw new AppError('Organization ID not found in user token', 400);
    }

    // An Inuma user only ever sees colleagues from their own campus.
    const result = await getUsersWithPositionsService(
      adminAccess ? undefined : organization_id,
      scope.campusUnitId
    );

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
    const scope = resolveCampusScope(req.user);

    const result = await getSingleUserWithPositionsService(user_id, {
      requesterUserId: req.user.user_id,
      isSuperAdmin: scope.isSuperAdmin,
      organizationId: req.user.organization_id,
      campusUnitId: scope.campusUnitId,
    });

    res.status(200).json({
      message: 'User retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

function isSuperAdminAccess(access: position_accesses | undefined): boolean {
  return !!(access?.organizations?.create && access?.users?.delete);
}

export const deleteUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isSuperAdminAccess(req.user?.position_access)) {
      throw new AppError('Only SuperAdmin can permanently delete users', 403);
    }

    const { user_id } = req.params;
    const actorUserId = req.user!.user_id;

    await deleteUserPermanentlyService({
      targetUserId: user_id,
      actorUserId,
    });

    res.status(200).json({
      message: 'User and related data deleted successfully',
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

export const updateMyProfileController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.user_id) {
      throw new AppError('Unauthorized', 401);
    }

    let user_photo = req.body.user_photo;

    // Handle file upload if a file was sent
    if (req.file) {
      user_photo = await uploadToCloudinary(req.file.buffer, 'Imotrak/users/avatars');
    }

    const payload = {
      ...req.body,
      ...(user_photo && { user_photo })
    };

    const result = await updateMyProfileService(req.user.user_id, payload);

    res.status(200).json({
      message: 'Profile updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUnverifiedUsersController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access.users.view) {
      throw new AppError('You do not have permission to view users', 403);
    }

    const { organization_id } = req.params;

    if (!organization_id) {
      throw new AppError('Organization has to be specified', 404);
    }

    const users = await getUnverifiedUsersService(organization_id);


    res.status(200).json({
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleUnverifiedUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access.users.view) {
      throw new AppError('You do not have permission to view users', 403);
    }

    const { organization_id, user_id } = req.params;

    if (!organization_id || !user_id) {
      throw new AppError('Organization ID and User ID must be specified', 404);
    }

    const user = await getSingleUnverifiedUserService(organization_id, user_id);

    if (!user) {
      throw new AppError('Unverified user not found', 404);
    }

    if (user.auth?.is_verified) {
      throw new AppError('User is already verified', 400);
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Move a user to another unit and position.
 *
 * Restricted to hub SuperAdmins and organization leaders. `users.update` is
 * deliberately not sufficient: changing someone's unit changes the scope of
 * everything they can see, so it sits above ordinary profile editing.
 */
export const changeUserPositionController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const actor = req.user as typeof req.user & { position_id: string };
    const superAdmin = isSuperAdmin(actor);
    const orgLeader = superAdmin ? false : await isOrgLeader(actor);

    if (!superAdmin && !orgLeader) {
      throw new AppError(
        'Only organization leaders and SuperAdmins can change a user’s unit and position',
        403
      );
    }

    const { user_id } = req.params;
    const { position_id } = req.body ?? {};

    if (typeof position_id !== 'string' || !position_id.trim()) {
      throw new AppError('position_id is required', 400);
    }

    const result = await changeUserPositionService({
      target_user_id: user_id,
      position_id: position_id.trim(),
      actor: {
        user_id: actor.user_id,
        organization_id: actor.organization_id,
        position_id: actor.position_id,
        position_access: actor.position_access,
      },
      actorIsSuperAdmin: superAdmin,
    });

    res.status(200).json({
      message: 'User position updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload or replace the signed-in user's signature image.
 *
 * Kept separate from the profile update because multer takes one field name
 * per route, and because a signature is not an ordinary profile edit — it is
 * what gets stamped on documents this person signs.
 */
export const updateMySignatureController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    if (!req.file) throw new AppError('Attach a signature image', 400);

    const signature_url = await uploadToCloudinary(
      req.file.buffer,
      'Imotrak/users/signatures'
    );
    const data = await updateMySignatureService(req.user.user_id, signature_url);

    res.status(200).json({ message: 'Signature saved successfully', data });
  } catch (error) {
    next(error);
  }
};
