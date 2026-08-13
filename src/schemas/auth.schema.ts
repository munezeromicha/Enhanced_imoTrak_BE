import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const ssoTokenSchema = z.object({
  id_token: z.string().min(1).optional(),
  access_token: z.string().min(1).optional(),
});

export const updatePasswordSchema = z.object({
  newPassword: z.string().nonempty("new password is empty").min(6),
  currentPassword: z.string().nonempty("current password is empty").min(6)
});

export const setPasswordAndVerifySchema = z.object({
  password: z.string().nonempty("new password is empty").min(6),
});