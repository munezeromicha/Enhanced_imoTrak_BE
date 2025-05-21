import dotenv from 'dotenv';
import { verifyPassword, hashPassword } from '../../utils/hash.js';
import { generateToken } from '../../utils/jwt.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

export const login = async (email, password) => {
  const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = process.env;

  if (email === SUPER_ADMIN_EMAIL) {
    // Auto-create Super Admin if not found in DB
    let admin = await prisma.user.findUnique({ where: { email } });

    if (!admin) {
      const hashed = await hashPassword(SUPER_ADMIN_PASSWORD);
      admin = await prisma.user.create({
        data: {
          email,
          password: hashed,
          role: 'super_admin',
        },
      });
    }

    const valid = await verifyPassword(admin.password, password);
    if (!valid) throw new Error('Invalid credentials');

    return generateToken({ id: admin.id, email, role: admin.role });
  }

  // Regular user login
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const valid = await verifyPassword(user.password, password);
  if (!valid) throw new Error('Invalid credentials');

  return generateToken({ id: user.id, email: user.email, role: user.role });
};
