import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const ssoTokenSchema = z
  .object({
    id_token: z.string().min(1).optional(),
    access_token: z.string().min(1).optional(),
    idToken: z.string().min(1).optional(),
    accessToken: z.string().min(1).optional(),
  })
  .transform((data) => ({
    id_token: data.id_token || data.idToken,
    access_token: data.access_token || data.accessToken,
  }));

export function bodyHasSsoTokens(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const value = body as Record<string, unknown>;
  return ['id_token', 'access_token', 'idToken', 'accessToken'].some(
    (key) => typeof value[key] === 'string' && (value[key] as string).trim().length > 0
  );
}

export const updatePasswordSchema = z.object({
  newPassword: z.string().nonempty("new password is empty").min(6),
  currentPassword: z.string().nonempty("current password is empty").min(6)
});

export const setPasswordAndVerifySchema = z.object({
  password: z.string().nonempty("new password is empty").min(6),
});