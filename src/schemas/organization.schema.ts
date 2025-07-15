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
