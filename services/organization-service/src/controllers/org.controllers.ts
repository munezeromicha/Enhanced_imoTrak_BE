import { NextFunction, Request, Response } from 'express';
import { uploadBufferToCloudinary } from '../utils/cloudinary';
import { 
  createOrganization,
  getAllOrganizations,
} from '../services/org.services';
import { v4 as uuidv4 } from 'uuid';

export const handleCreateOrganization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      organization_name,
      street_address,
      organization_phone,
      organization_email,
    } = req.body;

    let logoUrl: string | undefined;

    if (req.file?.buffer) {
      const upload = await uploadBufferToCloudinary(req.file.buffer, 'imotarak/organisations/logos');
      logoUrl = upload.url;
    }

    const organization = await createOrganization({
      organization_name,
      street_address,
      organization_phone,
      organization_email,
      organization_logo: logoUrl ?? '',
      organization_customId: `ORG-${uuidv4().slice(0, 8).toUpperCase()}`
    });

    res.status(201).json({
      message: 'Organization created successfully',
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetAllOrganizations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const organizations = await getAllOrganizations();
    res.status(200).json({
      message: 'Organizations fetched successfully',
      data: organizations,
    });
  } catch (error) {
    next(error);
  }
};