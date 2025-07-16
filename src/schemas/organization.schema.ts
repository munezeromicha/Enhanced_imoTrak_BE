import { z } from 'zod';


const phoneRegex = /^[0-9]{10,15}$/;

export const organizationSchema = z.object({
  organization_name: z.string().min(1),
  organization_email: z.string().email(),
  organization_phone: z
    .string()
    .regex(phoneRegex, 'Phone number must be 10 to 15 digits'),
  street_address: z.string(),
});

export const createUnitSchema = z.object({
  unit_name: z.string().min(1, 'Unit name is required'),
  organization_id: z.string().uuid('Invalid organization ID'),
});

export const positionAccessSchema = z.object({
  organizations: z.object({
    create: z.boolean(),
    view: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
  units: z.object({
    create: z.boolean(),
    view: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
  positions: z.object({
    create: z.boolean(),
    view: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
  users: z.object({
    create: z.boolean(),
    view: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
});

export const createPositionSchema = z.object({
  position_name: z.string().min(1),
  position_description: z.string().min(1),
  unit_id: z.string().uuid(),
  position_access: positionAccessSchema,
});


export const updateOrganizationSchema = z.object({
  organization_name: z.string().optional(),
  organization_email: z.string().email().optional(),
  organization_phone: z
    .string()
    .regex(/^\d{10,15}$/, 'Phone number must be 10 to 15 digits')
    .optional(),
  street_address: z.string().optional()
});
