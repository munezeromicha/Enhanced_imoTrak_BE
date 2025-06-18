import { Gender, PrismaClient, users, roles } from '@prisma/client';
import sendEmail from '../../../utils/mailSender';
import { mailUser } from '../../config/mailer';
import { AppError } from '../../../utils/Error';

const prisma = new PrismaClient();

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nid: string;
  gender: Gender;
  dob: string;
  streetAddress: string;
  roleId: string;
  organizationId: string;
  password_hash?: string;
}

interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nid: string;
  gender: Gender;
  dob: Date;
  streetAddress: string;
  role: string;
  organizationName: string;
  status: string;
}

export const HRService = {
  // Get available roles for HR to assign (staff and fleetmanager)
  getAvailableRoles: async (): Promise<{ id: string; name: string; description: string }[]> => {
    const roles = await prisma.roles.findMany({
      where: {
        name: {
          in: ['staff', 'fleetmanager']
        }
      },
      select: {
        id: true,
        name: true,
        description: true
      }
    });
    return roles;
  },

  // Get all users created by HR (staff and fleet managers)
  getUsers: async (hrUserId: string): Promise<UserResponse[]> => {
    // First get the HR user to get their organization
    const hrUser = await prisma.users.findUnique({
      where: { id: hrUserId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!hrUser) {
      throw new AppError('HR user not found', 404);
    }

    if (hrUser.roles.name !== 'hr') {
      throw new AppError('Access denied. Only HR users can view staff and fleet managers', 403);
    }

    const users = await prisma.users.findMany({
      where: {
        organization_id: hrUser.organization_id,
        roles: {
          name: {
            in: ['staff', 'fleetmanager']
          }
        }
      },
      include: {
        organizations: true,
        roles: true
      }
    });

    return users.map(user => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone || '',
      nid: user.nid,
      gender: user.gender,
      dob: user.dob,
      streetAddress: user.street_address,
      role: user.roles.name,
      organizationName: user.organizations.name,
      status: user.status
    }));
  },

  // Get user by ID (only if they belong to the same organization as HR)
  getById: async (userId: string, hrUserId: string): Promise<UserResponse | null> => {
    // First get the HR user to get their organization
    const hrUser = await prisma.users.findUnique({
      where: { id: hrUserId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!hrUser) {
      throw new AppError('HR user not found', 404);
    }

    if (hrUser.roles.name !== 'hr') {
      throw new AppError('Access denied. Only HR users can view staff and fleet managers', 403);
    }

    const user = await prisma.users.findFirst({
      where: {
        id: userId,
        organization_id: hrUser.organization_id,
        roles: {
          name: {
            in: ['staff', 'fleetmanager']
          }
        }
      },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone || '',
      nid: user.nid,
      gender: user.gender,
      dob: user.dob,
      streetAddress: user.street_address,
      role: user.roles.name,
      organizationName: user.organizations.name,
      status: user.status
    };
  },

  // Create staff or fleet manager
  createUser: async (data: CreateUserData, password: string, hrUserId: string): Promise<UserResponse> => {
    // First get the HR user to get their organization and verify permissions
    const hrUser = await prisma.users.findUnique({
      where: { id: hrUserId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!hrUser) {
      throw new AppError('HR user not found', 404);
    }

    if (hrUser.roles.name !== 'hr') {
      throw new AppError('Access denied. Only HR users can create staff and fleet managers', 403);
    }

    // Verify the role is valid (staff or fleetmanager)
    const role = await prisma.roles.findFirst({
      where: {
        id: data.roleId,
        name: {
          in: ['staff', 'fleetmanager']
        }
      }
    });

    if (!role) {
      throw new AppError('Invalid role. Only staff and fleetmanager roles are allowed', 400);
    }

    // Create the user in a transaction
    const user = await prisma.$transaction(async (tx) => {
      return await tx.users.create({
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password_hash: data.password_hash!,
          phone: data.phone,
          nid: data.nid,
          gender: data.gender,
          dob: new Date(data.dob),
          role_id: data.roleId,
          street_address: data.streetAddress,
          organization_id: hrUser.organization_id, // Auto-filled from HR's organization
        },
        include: {
          organizations: true,
          roles: true
        }
      });
    });

    // Send email asynchronously without blocking the response
    const mailOptions = {
      from: mailUser,
      to: data.email,
      subject: `Welcome to Imotrak - ${role.name.toUpperCase()} Account Created`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background-color: #f4f4f7;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #1442b7;
              padding: 20px;
              text-align: center;
              color: #ffffff;
            }
            .header img {
              max-height: 60px;
              margin-bottom: 10px;
            }
            .content {
              padding: 30px;
            }
            .content h2 {
              color: #1442b7;
              margin-bottom: 15px;
            }
            .info-box {
              background-color: #f0f4ff;
              border-left: 5px solid #1442b7;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .info-box p {
              margin: 8px 0;
              font-size: 16px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              margin-top: 20px;
              background-color: #1442b7;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              transition: background-color 0.3s ease;
            }
            .button:hover {
              background-color: #0f3699;
            }
            .footer {
              background-color: #f4f4f7;
              text-align: center;
              padding: 20px;
              font-size: 14px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${process.env.EMAIL_LOGO_URL || ''}" alt="Imotrak Logo" />
              <h1>Welcome to Imotrak!</h1>
            </div>

            <div class="content">
              <h2>Your ${role.name.toUpperCase()} account has been created 🎉</h2>
              <p>Hello ${data.firstName},</p>
              <p>You have been invited to join the Imotrak platform as a <strong>${role.name.toUpperCase()}</strong>. Please use the following credentials to log in:</p>

              <div class="info-box">
                <p><strong>Username (email):</strong> ${data.email}</p>
                <p><strong>Temporary Password:</strong> ${password}</p>
                <p><strong>Role:</strong> ${role.name.toUpperCase()}</p>
                <p><strong>Organization:</strong> ${hrUser.organizations.name}</p>
              </div>

              <p>We recommend you change your password after logging in.</p>

              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Login to Imotrak</a>
            </div>

            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Imotrak. All rights reserved.</p>
              <p>Need help? Contact us at ${process.env.SUPPORT_EMAIL || 'support@imotrak.rw'}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email asynchronously without blocking the response
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      sendEmail(mailOptions).catch((error) => {
        console.error('Email sending failed:', error);
        // Don't throw error here - just log it
        // The user is already created successfully
      });
    } else {
      console.warn('⚠️  Email not sent: Missing email credentials (MAIL_USER or MAIL_PASS)');
      console.warn('User created successfully but email notification was skipped');
    }

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone || '',
      nid: user.nid,
      gender: user.gender,
      dob: user.dob,
      streetAddress: user.street_address,
      role: user.roles.name,
      organizationName: user.organizations.name,
      status: user.status
    };
  },

  // Update user
  updateUser: async (userId: string, data: Partial<CreateUserData>, hrUserId: string): Promise<UserResponse> => {
    // First get the HR user to get their organization and verify permissions
    const hrUser = await prisma.users.findUnique({
      where: { id: hrUserId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!hrUser) {
      throw new AppError('HR user not found', 404);
    }

    if (hrUser.roles.name !== 'hr') {
      throw new AppError('Access denied. Only HR users can update staff and fleet managers', 403);
    }

    // Verify the user belongs to the same organization and is staff/fleetmanager
    const existingUser = await prisma.users.findFirst({
      where: {
        id: userId,
        organization_id: hrUser.organization_id,
        roles: {
          name: {
            in: ['staff', 'fleetmanager']
          }
        }
      }
    });

    if (!existingUser) {
      throw new AppError('User not found or access denied', 404);
    }

    const updates: any = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      street_address: data.streetAddress,
      nid: data.nid,
      gender: data.gender
    };

    if (data.dob) {
      updates.dob = new Date(data.dob);
    }

    if (data.roleId) {
      // Verify the new role is valid
      const role = await prisma.roles.findFirst({
        where: {
          id: data.roleId,
          name: {
            in: ['staff', 'fleetmanager']
          }
        }
      });

      if (!role) {
        throw new AppError('Invalid role. Only staff and fleetmanager roles are allowed', 400);
      }
      updates.role_id = data.roleId;
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updates,
      include: {
        organizations: true,
        roles: true
      }
    });

    return {
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      nid: updatedUser.nid,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      streetAddress: updatedUser.street_address,
      role: updatedUser.roles.name,
      organizationName: updatedUser.organizations.name,
      status: updatedUser.status
    };
  },

  // Delete user
  deleteUser: async (userId: string, hrUserId: string): Promise<void> => {
    // First get the HR user to get their organization and verify permissions
    const hrUser = await prisma.users.findUnique({
      where: { id: hrUserId },
      include: {
        organizations: true,
        roles: true
      }
    });

    if (!hrUser) {
      throw new AppError('HR user not found', 404);
    }

    if (hrUser.roles.name !== 'hr') {
      throw new AppError('Access denied. Only HR users can delete staff and fleet managers', 403);
    }

    // Verify the user belongs to the same organization and is staff/fleetmanager
    const existingUser = await prisma.users.findFirst({
      where: {
        id: userId,
        organization_id: hrUser.organization_id,
        roles: {
          name: {
            in: ['staff', 'fleetmanager']
          }
        }
      }
    });

    if (!existingUser) {
      throw new AppError('User not found or access denied', 404);
    }

    await prisma.users.delete({
      where: { id: userId }
    });
  }
}; 