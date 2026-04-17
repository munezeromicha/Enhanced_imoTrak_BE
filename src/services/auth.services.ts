import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/Error';
import { signToken, verifyToken } from '../utils/jwt'
import { generateRandomPassword } from '../utils/password';
import { sendForgotPasswordEmail, sendInvitationEmail } from '../utils/sendCredentials';
import { AuthenticatedUser } from '../types/access';

const prisma = new PrismaClient();

interface UpdatePasswordPayload {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export async function loginUser(email: string, password: string) {
  // Find auth + user + positions + units + organizations
  const authWithUser = await prisma.tbl_auth.findUnique({
    where: { email },
    include: {
      user: {
        include: {
          positions: {
            include: {
              unit: {
                include: {
                  organization: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!authWithUser || !authWithUser.password) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const validPassword = await argon2.verify(authWithUser.password, password);
  if (!validPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!authWithUser.user) {
    throw new AppError('User profile not found', 500);
  }

  // Map positions info to response format
  const positionsData = authWithUser.user.positions.map((position) => ({
    position_id: position.position_id,
    position_name: position.position_name,
    unit_id: position.unit.unit_id,
    unit_name: position.unit.unit_name,
    organisation_id: position.unit.organization.organization_id,
    organization_name: position.unit.organization.organization_name,
  }));

  if (positionsData.length === 0) {
    throw new AppError('No position assigned to this account. Please contact your administrator.', 403);
  }

  return positionsData
}

export async function loginWithPosition(email: string, password: string, position_id: string) {
  const auth = await prisma.tbl_auth.findUnique({
    where: { email },
    include: {
      user: {
      },
    },
  });

  if (!auth || !auth.password || !auth.user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (auth.user_status !== 'ACTIVE') {
    throw new AppError('User is not active', 403);
  }

  const isValid = await argon2.verify(auth.password, password);
  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const position = await prisma.tbl_position.findUnique({
    where: { position_id },
    include: {
      unit: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!position) {
    throw new AppError('Position not found', 404);
  }

  if (position.user_id !== auth.user.user_id) {
    throw new AppError('Unauthorized: position does not belong to user', 403);
  }

  if (position.position_status !== 'ACTIVE') {
    throw new AppError('Position is not active', 403);
  }

  const token = signToken({
    user_id: auth.user.user_id,
    email: auth.email!,
    position_id,
    organization_id: position.unit.organization.organization_id
  });

  const {unit, ...positionOut} = position
  const {organization, ...unitOut} = unit
  return {
    token,
    organization: position.unit.organization,
    user: auth.user,
    position: positionOut,
    unit: unitOut,
  }
}

export async function logoutUser(token: string, meta?: { ip: string, userAgent: string }): Promise<void> {
  try {
    // Verify the token to get user information and expiration
    const decoded = verifyToken(token);

    // Get the actual expiration time from the JWT token
    const tokenData = jwt.decode(token) as any;
    const expiresAt = new Date(tokenData.exp * 1000); // Convert from seconds to milliseconds

    // Add token to blacklist
    await prisma.tbl_jwt_blacklist.create({
      data: {
        token,
        user_id: decoded.user_id,
        expires_at: expiresAt
      }
    });
    if (meta) {
      await prisma.tbl_audit_logs.create({
        data: {
          user_id: decoded.user_id,
          action: "LOGOUT",
          table_name: "tbl_users",
          record_id: decoded.user_id,
          ip_address: meta.ip,
          user_agent: meta.userAgent
        }
      });
    }
  } catch (error) {
    // Even if token verification fails, we still want to blacklist it
    // to prevent any potential replay attacks
    // Use a reasonable expiration time for invalid tokens
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.tbl_jwt_blacklist.create({
      data: {
        token,
        user_id: 'unknown', // We don't know the user_id if token is invalid
        expires_at: expiresAt
      }
    });

    throw new AppError('Invalid token', 401);
  }
}

export async function logoutAllUserSessions(userId: string): Promise<void> {
  // This function would be used to logout from all devices
  // For now, we'll just clean up expired tokens
  await cleanupExpiredTokens();
}

async function cleanupExpiredTokens(): Promise<void> {
  try {
    const now = new Date();
    await prisma.tbl_jwt_blacklist.deleteMany({
      where: {
        expires_at: {
          lt: now
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}

export const updatePasswordService = async (inputs: UpdatePasswordPayload) => {
  const user = await prisma.tbl_auth.findUnique({
    where: { email: inputs.email}
  });

  if (!user || !user.password)
    throw new AppError("Account not found", 404);

  if (!await argon2.verify(user?.password, inputs.currentPassword))
    throw new AppError("Invalid credentials", 401);

  const updates = await prisma.tbl_auth.update({
    where: { email: inputs.email},
    data: {
      password: await argon2.hash(inputs.newPassword),
      updated_at: new Date().toISOString()
    }
  });

  const {password, ...safeRes} = updates

  return safeRes;
}

export const forgotPasswordService = async ( email: string ) => {
  const account = await prisma.tbl_auth.findUnique({
    where: {email}
  });

  if(!account || account.user_status !== 'ACTIVE')
    throw new AppError('Account not found', 404)

  const newPassword = generateRandomPassword();
  await prisma.tbl_auth.update({
    where: {email},
    data: {password: await argon2.hash(newPassword)}
  });
  
  try {
    await sendForgotPasswordEmail(email, newPassword);
  } catch (error) {
    console.error('Failed to send email:', error);
  }

  return;
}

export async function verifyUserByEmailService(email: string, token: string) {
  const authRecord = await prisma.tbl_auth.findUnique({
    where: {
      email,
    },
    include: {
      user: {
        include: {
          positions: {
            include: {
              unit: {
                include: {
                  organization: true
                }
              }
            }
          }
        }
      },
    }, 
  });

  if (!authRecord || !authRecord.user || !authRecord.user.positions || authRecord.user.positions.length === 0 || !authRecord.email) {
    throw new AppError('User not found', 404);
  }

  if (authRecord.is_verified) {
    throw new AppError('User is already verified', 409);
  }

  const tokenData = jwt.decode(token) as any;
  const expiresAt = new Date(tokenData.exp * 1000);

  await prisma.tbl_jwt_blacklist.create({
    data: {
      token,
      user_id: authRecord.user?.user_id,
      expires_at: expiresAt
    }
  });

  return {
    token: signToken({
      user_id: authRecord.user.user_id,
      email: authRecord.email,
      position_id: authRecord.user.positions[0]?.position_id,
      organization_id: authRecord.user.positions[0]?.unit?.organization?.organization_id
    })
  }
}

export async function setPasswordAndVerifyService(email: string, newPassword: string, token: string ) {
  const authRecord = await prisma.tbl_auth.findUnique({
    where: { email },
    include: {
      user: {
        include: {
          positions: {
            include: {
              unit: {
                include: {
                  organization: true
                }
              }
            }
          }
        }
      },
    },  
  });

  if (!authRecord || !authRecord.user || !authRecord.user.positions || authRecord.user.positions.length === 0 || !authRecord.email) {
    throw new AppError('User not found', 404);
  }

  if (authRecord.is_verified) {
    throw new AppError('Account is already verified', 409);
  }

  const hashedPassword = await argon2.hash(newPassword);


  const tokenData = jwt.decode(token) as any;
  const expiresAt = new Date(tokenData.exp * 1000);  
  
  const [blacklistedToken, updatedAuth] = await prisma.$transaction([
    prisma.tbl_jwt_blacklist.create({
      data: {
        token,
        user_id: authRecord.user?.user_id ?? '', // fallback to empty string if undefined
        expires_at: expiresAt,
      },
    }),
    prisma.tbl_auth.update({
      where: { email },
      data: {
        password: hashedPassword,
        is_verified: true,
        updated_at: new Date(),
      },
    }),
  ]);

  return {
    message: 'Account verified and password set successfully',
    auth_id: updatedAuth.auth_id,
    email: updatedAuth.email,
    updated_at: updatedAuth.updated_at,
    user_status: updatedAuth.user_status,
  };
}

export async function resendInvitationService(email: string) {
  const authRecord = await prisma.tbl_auth.findUnique({
    where: {
      email,
    },
    include: {
      user: {
        include: {
          positions: {
            include: {
              unit: {
                include: {
                  organization: true,
                } 
              }
            }
          }
        }
      },
    },
  });

  if (!authRecord || !authRecord.user) {
    throw new AppError('User not found', 404);
  }

  if (authRecord.is_verified) {
    throw new AppError('User is already verified', 409);
  }


  try {
    const jwtSecret = process.env.JWT_SECRET as string
    const expiresIn = (process.env.VERIFY_LINK_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'];
    if (!jwtSecret) {
      throw new Error('JWT secret is not defined');
    }
    await sendInvitationEmail(email, jwt.sign({email}, jwtSecret, {expiresIn}), authRecord.user.positions[0].position_name, authRecord.user.positions[0].unit.unit_name, authRecord.user.positions[0].unit.organization.organization_name );
  } catch (error) {
    console.error('Failed to send email:', error);
  }

  return; 
}