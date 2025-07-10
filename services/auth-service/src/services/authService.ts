import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const loginService = async (email: string, password: string): Promise<string> => {
  const user = await prisma.tbl_auth.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new Error('Invalid credentials');
  }
  if (user.user_status !== 'ACTIVE') {
    throw new Error('User is not active');
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }
  // Generate JWT with auth_id and user_status
  return generateToken({ auth_id: user.auth_id, user_status: user.user_status });
}; 