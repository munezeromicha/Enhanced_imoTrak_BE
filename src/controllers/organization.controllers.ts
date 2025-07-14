// controllers/organization.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';
import { generateCustomId } from '../utils/idGenerator';

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
    const { organization_name, organization_email, organization_phone, organization_logo, street_address } = req.body;

    console.log(req.user);
    // Access check
    if (!req.user?.position_access?.organizations?.create) {
      throw new AppError('You do not have permission to create organizations', 403);
    }

    const organization_customId = generateCustomId('ORG');

    const organization = await prisma.tbl_organizations.create({
      data: {
        organization_customId,
        organization_status: 'ACTIVE',
        organization_name,
        organization_email,
        organization_phone,
        organization_logo,
        street_address
      }
    });

    res.status(201).json({
      success: true,
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
