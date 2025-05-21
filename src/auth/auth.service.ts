import dotenv from 'dotenv';
import { verifyPassword, hashPassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

interface LoginResult {
  token: string;
}

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = process.env;

  if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
    throw new Error('Super Admin credentials are not set in environment variables.');
  }

  if (email === SUPER_ADMIN_EMAIL) {
    // Handle Super Admin login
    let admin = await prisma.users.findUnique({ where: { email } });

    if (!admin) {
      const hashed = await hashPassword(SUPER_ADMIN_PASSWORD);
      admin = await prisma.users.create({
        data: {
          email,
          password_hash: hashed,
          username: 'superadmin',
          full_name: 'Super Admin',
          role_id: 'super_admin',
          organization_id: '100',
          status: 'active',
        },
      });
    }

    const valid = await verifyPassword(admin.password_hash, password);
    if (!valid) throw new Error('Invalid credentials');

    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role_id });
    return { token };
  }

  // Handle Regular User
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const valid = await verifyPassword(user.password_hash, password);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken({ id: user.id, email: user.email, role: user.role_id });
  return { token };
};
