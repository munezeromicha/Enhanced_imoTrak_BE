import { Request, Response, NextFunction } from 'express';
import { createOrganizationSchema } from '../utils/org.validator';

export const validateCreateOrganization = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createOrganizationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }

  next();
};
