import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from '../services/organization.service';

export const registerOrganization = async (req: Request, res: Response) => {
  try {
    const { name, address, phone, email } = req.body;
    const organization = await createOrganization({ name, address, phone, email });
    res.status(201).json(organization);
  } catch (error) {
    console.error('Error registering organization:', error);
    res.status(500).json({ error: 'Failed to register organization' });
  }
};

export const getOrganizations = async (_req: Request, res: Response) => {
  try {
    const organizations = await getAllOrganizations();
    res.json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};

export const getOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const organization = await getOrganizationById(id);
    if (!organization) {
      res.status(404).json({ error: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
};

export const editOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateOrganization(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ error: 'Failed to update organization' });
  }
};

export const removeOrganization = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await deleteOrganization(id);
    res.sendStatus(204);
  } catch (err: any) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      res.status(404).json({ message: 'Organization not found' });
    }

    console.error('Error deleting organization:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
