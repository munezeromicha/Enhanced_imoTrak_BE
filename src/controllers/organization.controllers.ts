import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';
import { generateCustomId } from '../utils/idGenerator';
import { uploadToCloudinary } from '../utils/cloudinary';
import {
  createOrganizationService,
  createUnitService,
  getOrganizationsService
} from '../services/organization.services';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
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
