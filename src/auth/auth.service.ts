import dotenv from 'dotenv';
import { verifyPassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
}

export const login = async ({ email, password }: LoginRequest): Promise<LoginResult> => {
  const { SUPER_ADMIN_EMAIL } = process.env;

  // Fetch user by email
  const user = await prisma.users.findUnique({
    where: { email },
    include: {
      roles: true,
  },
});
  if (!user) throw new Error('User not found');

  // Check password
  const valid = await verifyPassword(user.password_hash, password);
  if (!valid) throw new Error('Invalid credentials');

  // Sign JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.roles.name,
  });

  return { token };
};
