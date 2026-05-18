import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma/prisma.client';
import { AppError } from '../utils/Error';
import { position_accesses } from '../types/access';

function isHubAdmin(access: position_accesses | undefined) {
  return !!(access?.organizations?.create && access?.users?.view);
}

function handleContactPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2021') {
      throw new AppError(
        'Contacts table is missing on this database. Run `npm run migrate:deploy` on the server, then restart the API.',
        503,
      );
    }
  }
  throw error;
}

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

    let contact;
    try {
      contact = await prisma.tbl_contacts.create({
        data: {
          name,
          email,
          message,
        },
      });
    } catch (error) {
      handleContactPrismaError(error);
    }

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
    if (!isHubAdmin(req.user?.position_access)) {
      throw new AppError('You do not have permission to view contacts', 403);
    }

    let contacts;
    try {
      contacts = await prisma.tbl_contacts.findMany({
        orderBy: { created_at: 'desc' },
      });
    } catch (error) {
      handleContactPrismaError(error);
    }

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
    if (!isHubAdmin(req.user?.position_access)) {
      throw new AppError('You do not have permission to update contacts', 403);
    }

    const { id } = req.params;
    let contact;
    try {
      contact = await prisma.tbl_contacts.update({
        where: { contact_id: id },
        data: { is_read: true },
      });
    } catch (error) {
      handleContactPrismaError(error);
    }

    res.status(200).json({
      message: 'Contact marked as read',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
