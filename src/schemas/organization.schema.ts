import { z } from 'zod';
import { positionAccessSchema } from './position.schema';


const phoneRegex = /^[0-9]{10,15}$/;

export const organizationSchema = z.object({
  organization_name: z.string().min(1),
  organization_email: z.string().email(),
  organization_phone: z
    .string()
    .regex(phoneRegex, 'Phone number must be 10 to 15 digits'),
  street_address: z.string(),
  uses_reservations: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .optional()
    .transform((v) => (v === undefined ? true : v === true || v === 'true')),
  leader_unit_name: z.string().min(1).optional(),
  leader_position_name: z.string().min(1).optional(),
});

export const createUnitSchema = z.object({
  unit_name: z.string().min(1, 'Unit name is required'),
  organization_id: z.string().uuid('Invalid organization ID'),
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
  street_address: z.string().optional(),
  uses_reservations: z.boolean().optional(),
});

export const updateUnitSchema = z.object({
  unit_name: z.string().min(1, 'Unit name is required'),
});

