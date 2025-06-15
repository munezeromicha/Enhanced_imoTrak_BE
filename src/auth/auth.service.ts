import dotenv from 'dotenv';
import { verifyPassword } from '../../utils/hash';
import { seedAdmin } from '../../utils/seedAdmin';
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
      if (!superadmin) throw new Error('Superadmin not found after seeding');
      
      // Sign JWT token for superadmin
      const token = generateToken({
        id: superadmin.id,
        email: superadmin.email,
        role: superadmin.roles.name,
      });
      
      return { token };
    }
    throw new Error('User not found');
  }

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
