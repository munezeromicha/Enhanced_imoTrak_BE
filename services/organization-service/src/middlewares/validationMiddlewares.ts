import { Request, Response, NextFunction } from 'express';
import { createOrganizationSchema } from '../utils/org.validator';
import Joi from 'joi';

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

const createUnitSchema = Joi.object({
  unit_name: Joi.string().required().messages({
    'string.base': 'Unit name must be a string',
    'any.required': 'Unit name is required',
  }),
  organization_id: Joi.string().uuid().required().messages({
    'string.base': 'Organization ID must be a string',
    'string.guid': 'Organization ID must be a valid UUID',
    'any.required': 'Organization ID is required',
  }),
});

export const validateCreateUnit = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createUnitSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const PositionAccessSchema = Joi.object({
  organisation: Joi.object({
    canViewOrgs: Joi.boolean().required(),
    canEditOrgs: Joi.boolean().required(),
    canDeleteOrgs: Joi.boolean().required(),
    canCreateOrgs: Joi.boolean().required(),
    
    canCreateUnitOrgUnits: Joi.boolean().required(),
    canViewAllUnits: Joi.boolean().required(),
    canViewOrgUnits: Joi.boolean().required(),
    canCreatePosition: Joi.boolean().required()
  }).required()
});

// The main schema to create a position
const createPositionSchema = Joi.object({
  position_name: Joi.string().optional(),
  position_description: Joi.string().optional(),
  position_access: PositionAccessSchema.required(),  // Ensure position_access matches the PositionAccessSchema
  unit_id: Joi.string().uuid().required(),
});

export const validateCreatePosition = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createPositionSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map((d) => d.message),
    });
  }

  next();
};


