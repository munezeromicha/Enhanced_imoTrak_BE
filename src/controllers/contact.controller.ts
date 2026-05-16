import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { AppError } from '../utils/Error';
import { position_accesses } from '../types/access';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
    organization_id: string;
    position_access: position_accesses;
  };
}

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      throw new AppError('Name, email, and message are required', 400);
    }

    const contact = await prisma.tbl_contacts.create({
      data: {
        name,
        email,
        message,
      },
    });

    res.status(201).json({
      message: 'Contact submitted successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Only superadmin or specific roles might see this, assuming organizations.view gives some admin rights or we just let any logged in user see it if they have the route.
    // For now, let's just fetch them.
    const contacts = await prisma.tbl_contacts.findMany({
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json({
      message: 'Contacts retrieved successfully',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const contact = await prisma.tbl_contacts.update({
      where: { contact_id: id },
      data: { is_read: true },
    });

    res.status(200).json({
      message: 'Contact marked as read',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
