import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';
import { generateCustomId } from '../utils/idGenerator';
import { uploadToCloudinary } from '../utils/cloudinary';
import {
  createOrganizationService,
  createPositionService,
  createUnitService,
  deleteOrganizationService,
  deleteUnitService,
  getOrganizationsService,
  getPositionsInUnitService,
  getSingleOrganizationService,
  getSinglePositionService,
  getSingleUnitService,
  getUnitsService,
  softDeletePositionService,
  updateOrganizationService,
  updateUnitService
} from '../services/organization.services';
import { updateUnitSchema } from '../schemas/organization.schema';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
    organization_id: string;
    position_access?: any;
  };
}

export const createOrganizationController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organization_name, organization_email, organization_phone, street_address } = req.body;

    if (!req.user?.position_access?.organizations?.create) {
      throw new AppError('You do not have permission to create organizations', 403);
    }

    let logoUrl = '';

    if (req.file) {
      logoUrl = await uploadToCloudinary(req.file.buffer, 'Imotrak/organization_logo');
    }
    else {
      throw new AppError('Organization logo is required', 400)
    }

    const organization_customId = generateCustomId('ORG');

    const organization = await createOrganizationService({
        organization_customId,
        organization_name,
        organization_email,
        organization_phone,
        organization_logo: logoUrl,
        street_address
    });

    res.status(201).json({
      message: 'Organization created successfully',
      data: organization
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      throw new AppError(`Organization ${field} already exists`, 409);
    }
    next(error);
  }
};

export const getOrganizationsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access?.organizations?.view) {
      throw new AppError('You do not have permission to view organizations', 403);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as any; // validated in schema or assumed valid enum

    const result = await getOrganizationsService({ page, limit, status });

    res.status(200).json({
      message: 'Organizations retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createUnitController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access?.units?.create) {
      throw new AppError('You do not have permission to create units', 403);
    }

    const { unit_name, organization_id } = req.body;

    const newUnit = await createUnitService({ unit_name, organization_id });

    res.status(201).json({
      message: 'Unit created successfully',
      data: newUnit,
    });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return next(new AppError('Organization not found', 404));
    }
    if (error.code === 'P2002') {
      return next(new AppError('Unit name already exists in this organization', 409));
    }
    next(error);
  }
};

export const createPositionController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access?.positions?.create) {
      throw new AppError('You do not have permission to create positions', 403);
    }

    const { position_name, position_description, unit_id, position_access } = req.body;

    const unit = await prisma.tbl_unit.findUnique({
      where: { unit_id },
      select: { organization_id: true, status: true },
    });

    if (!unit || unit.status !== 'ACTIVE') {
      throw new AppError('Unit not found or inactive', 404);
    }

    // Check org ownership if user lacks org creation access
    if (!req.user.position_access.organizations.create) {
      if (unit.organization_id !== req.user.organization_id) {
        throw new AppError('You cannot create a position outside your organization', 403);
      }
    }

    const position = await createPositionService({
      position_name,
      position_description,
      unit_id,
      position_access,
    });

    res.status(201).json({
      message: 'Position created successfully',
      data: position,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return next(new AppError('Position name already exists in this unit', 409));
    }
    if (error.code === 'P2003') {
      return next(new AppError('Unit not found', 404));
    }
    next(error);
  }
};

export const deletePositionController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { positionId } = req.params;
    const result = await softDeletePositionService(
      positionId,
      req.user!.user_id,
      req.user!.position_access
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPositionsInUnitController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access.positions.view) {
      throw new AppError('You do not have permission to view positions', 403);
    }

    const unit_id = req.params.unit_id;
    const requesterOrgId = req.user.organization_id;
    const hasOrgViewAccess = req.user.position_access.organizations.view;

    const positions = await getPositionsInUnitService({
      unit_id,
      requesterOrgId,
      hasOrgViewAccess,
    });

    res.status(200).json({
      message: 'Positions retrieved successfully',
      data: positions,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnitsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.position_access.units.view) {
      throw new AppError('You do not have permission to view units', 403);
    }

    const organization_id = req.user.organization_id;

    if (!organization_id) {
      throw new AppError('Organization ID not found in user token', 400);
    }

    const units = await getUnitsService(organization_id);

    res.status(200).json({ units });
  } catch (error) {
    next(error);
  }
};

export const getSingleOrganizationController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organization_id } = req.params;

    if (!req.user?.position_access?.organizations?.view) {
      throw new AppError('You do not have permission to view organizations', 403);
    }

    const organization = await getSingleOrganizationService({
      organization_id,
      user: req.user
    });

    res.status(200).json({
      message: 'Organization retrieved successfully',
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organization_id } = req.params;

    if (!req.user?.position_access?.organizations?.update) {
      throw new AppError('You do not have permission to update organizations', 403);
    }

    let logoUrl: string | undefined;

    if (req.file) {
      logoUrl = await uploadToCloudinary(req.file.buffer, 'Imotrak/organization_logo');
    }

    const updatedOrganization = await updateOrganizationService({
      organization_id,
      updates: {
        ...req.body,
        ...(logoUrl && { organization_logo: logoUrl })
      }
    });

    res.status(200).json({
      message: 'Organization updated successfully',
      data: updatedOrganization
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganizationController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organization_id } = req.params;

    if (!req.user?.position_access?.organizations?.delete) {
      throw new AppError('You do not have permission to delete organizations', 403);
    }

    await deleteOrganizationService({ organization_id });

    res.status(200).json({
      message: 'Organization deleted successfully',
      data:null
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleUnitController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { unit_id } = req.params;

    if (!req.user?.position_access?.units?.view) {
      throw new AppError('You do not have permission to view units', 403);
    }

    const unit = await getSingleUnitService({
      unit_id,
      user: req.user
    });

    res.status(200).json({
      message: 'Unit retrieved successfully',
      data: unit
    });
  } catch (error) {
    next(error);
  }
};

export const updateUnitController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { unit_id } = req.params;

    if (!req.user?.position_access?.units?.update) {
      throw new AppError('You do not have permission to update units', 403);
    }

    const validatedData = updateUnitSchema.parse(req.body);

    const updatedUnit = await updateUnitService({
      unit_id,
      user: req.user,
      data: validatedData,
    });

    res.status(200).json({
      message: 'Unit updated successfully',
      data: updatedUnit,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUnitController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { unit_id } = req.params;

    if (!req.user?.position_access?.units?.delete) {
      throw new AppError('You do not have permission to delete units', 403);
    }

    await deleteUnitService({ unit_id, user: req.user });

    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSinglePositionController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { position_id } = req.params;

    if (!req.user?.position_access?.positions?.view) {
      throw new AppError('You do not have permission to view positions', 403);
    }

    const position = await getSinglePositionService({ position_id, user: req.user });

    res.status(200).json({
      message: 'Position retrieved successfully',
      data: position
    });
  } catch (error) {
    next(error);
  }
};
