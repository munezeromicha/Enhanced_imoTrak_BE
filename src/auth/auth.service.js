import dotenv from 'dotenv';
import { verifyPassword } from '../../utils/hash.js';
import { generateToken } from '../../utils/jwt.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

export const login = async (email, password) => {
  // Super admin login
  if (email === process.env.SUPER_ADMIN_EMAIL) {
    const valid = await verifyPassword(process.env.SUPER_ADMIN_PASSWORD, password);
    if (!valid) throw new Error('Invalid credentials');
    return generateToken({ role: 'super_admin', email });
  }

  // Normal users from DB
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  
  const valid = await verifyPassword(user.password, password);
  if (!valid) throw new Error('Invalid credentials');

  return generateToken({ id: user.id, email: user.email, role: user.role });
};
