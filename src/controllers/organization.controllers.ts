import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';
import { generateCustomId } from '../utils/idGenerator';
import { uploadToCloudinary } from '../utils/cloudinary'; // Make sure this exists
import { createOrganizationService } from '../services/organization.services';

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
