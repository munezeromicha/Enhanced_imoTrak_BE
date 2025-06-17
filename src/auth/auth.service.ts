import dotenv from 'dotenv';
import { verifyPassword } from '../../utils/hash';
import { seedAdmin } from '../../utils/seedAdmin';
import { generateToken } from '../../utils/jwt';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../utils/Error';


dotenv.config();
const prisma = new PrismaClient();

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
}

interface SystemRole {
  id: string;
  name: string;
  description: string;
}

export const login = async ({ email, password }: LoginRequest): Promise<LoginResult> => {
  const superadminEmail = process.env.SUPERADMIN_EMAIL;
  const superadminPassword = process.env.SUPERADMIN_PASSWORD;

  // Fetch user by email
  const user = await prisma.users.findUnique({
    where: { email },
    include: {
      roles: true,
    },
  });

  if (!user){
    if (email === superadminEmail && password === superadminPassword) {
      // If user not found, check if superadmin credentials match
      await seedAdmin(); // Ensure superadmin is seeded
      const superadmin = await prisma.users.findUnique({
        where: { email: superadminEmail },
        include: { roles: true },
      });
      if (!superadmin) throw new AppError('Superadmin not found after seeding', 400);
      
      // Sign JWT token for superadmin
      const token = generateToken({
        id: superadmin.id,
        email: superadmin.email,
        role: superadmin.roles.name,
      });
      
      return { token };
    }
    throw new AppError('User not found', 400);
  }

  // Check password
  const valid = await verifyPassword(user.password_hash, password);
  if (!valid) throw new AppError('Invalid credentials');

  // Sign JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.roles.name,
  });

  return { token };
};
export const systemRoles = async (role: string): Promise<SystemRole[]> => {
  if (role === 'admin') {
    return await prisma.roles.findMany({ where: { name: 'hr' } });
  } else if (role === 'hr') {
    return await prisma.roles.findMany({ where: { name: { in: ['staff', 'fleetmanager'] } } });
  } else {
    throw new Error('Forbidden');
  }
};
