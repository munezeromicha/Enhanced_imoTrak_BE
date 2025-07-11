import Joi from 'joi';

export const createOrganizationSchema = Joi.object({
  organization_name: Joi.string().trim().required().messages({
    'string.base': 'Organization name must be a string',
    'string.empty': 'Organization name is required',
    'any.required': 'Organization name is required',
  }),
  street_address: Joi.string().trim().required().messages({
    'string.base': 'Street address must be a string',
    'string.empty': 'Street address is required',
    'any.required': 'Street address is required',
  }),
  organization_phone: Joi.string().trim().required().messages({
    'string.base': 'Phone number must be a string',
    'string.empty': 'Phone number is required',
    'any.required': 'Phone number is required',
  }),
  organization_email: Joi.string().trim().email().required().messages({
    'string.email': 'Must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  organization_logo: Joi.any().optional().meta({ swaggerType: 'file' }).description('Logo file (optional)'), // used for form-data
});
