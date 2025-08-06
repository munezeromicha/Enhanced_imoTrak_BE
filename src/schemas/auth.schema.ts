import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const updatePasswordSchema = z.object({
  newPassword: z.string().nonempty("new password is empty").min(6),
  currentPassword: z.string().nonempty("current password is empty").min(6)
});

export const setPasswordAndVerifySchema = z.object({
  password: z.string().nonempty("new password is empty").min(6),
});