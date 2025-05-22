import dotenv from 'dotenv';
import { verifyPassword, hashPassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

interface LoginRequest {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
  organization_id?: string;
}

interface LoginResult {
  token: string;
}

export const login = async ({
  email,
  password,
  username,
  full_name,
  organization_id,
}: LoginRequest): Promise<LoginResult> => {
  const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = process.env;

  if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
    throw new Error('Super Admin credentials are not set in environment variables.');
  }

  // Super Admin Login
  if (email === SUPER_ADMIN_EMAIL) {
    let admin = await prisma.users.findUnique({ where: { email } });

    if (!admin) {
      const hashed = await hashPassword(SUPER_ADMIN_PASSWORD);

      // Get organization
      const org = await prisma.organizations.findFirst({ where: { name: 'Binary Hub' } });
      if (!org && !organization_id) throw new Error('Organization not found');
      const resolvedOrgId = organization_id || org?.id;

      // Get role
      const role = await prisma.roles.findUnique({
        where: { name: 'super_admin' },
      });
      if (!role) throw new Error("Role 'super_admin' not found");

      console.log('Creating super admin with role ID:', role.id); // debug

      // Create admin
      admin = await prisma.users.create({
        data: {
          email,
          password_hash: hashed,
          username: username || 'superadmin',
          full_name: full_name || 'Super Admin',
          role_id: role.id, // UUID ✅
          organization_id: resolvedOrgId!, // safe due to earlier check
          status: 'active',
        },
      });
    }

    const valid = await verifyPassword(admin.password_hash, password);
    if (!valid) throw new Error('Invalid credentials');

    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role_id });
    return { token };
  }

  // Regular user login
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const valid = await verifyPassword(user.password_hash, password);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken({ id: user.id, email: user.email, role: user.role_id });
  return { token };
};
