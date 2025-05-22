import { Request, Response } from 'express';
import { createOrganization } from '../services/organization.service';

export const registerOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, address, phone, email } = req.body;

    const organization = await createOrganization({ name, address, phone, email });

    res.status(201).json(organization);
  } catch (error) {
    console.error('Error registering organization:', error);
    res.status(500).json({ error: 'Failed to register organization' });
  }
};
