import { z } from 'zod';

export const organizationSchema = z.object({
  organization_name: z.string().min(1),
  organization_email: z.string().email().optional(),
  organization_phone: z.string().optional(),
  organization_logo: z.string().optional(),
  street_address: z.string().optional(),
});
