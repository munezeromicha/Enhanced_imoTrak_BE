import { z } from 'zod';

export const createUserSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  user_nid: z.string().regex(/^\d{16}$/, {
    message: "Invalid Rwandan NID: must be exactly 16 digits",
  }),
  user_phone: z.string().min(10).max(15),
  user_gender: z.enum(['MALE', 'FEMALE']),
  street_address: z.string().optional(),
  user_dob: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for user_dob",
  }),
  position_id: z.string().uuid(),
  email: z.string().email(),
});

export const updateUserSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  user_nid: z.string().optional(),
  user_phone: z.string().min(10).max(15).optional(),
  user_gender: z.enum(['MALE', 'FEMALE']).optional(),
  user_dob: z.coerce.date().optional(),
  street_address: z.string().nullable().optional(),
  user_photo: z.string().nullable().optional(),
});
