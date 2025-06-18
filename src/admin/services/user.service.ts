import { Gender, PrismaClient, users } from '@prisma/client';
import sendEmail from '../../../utils/mailSender'
import { mailUser } from '../../config/mailer';
import { AppError } from '../../../utils/Error';
const prisma = new PrismaClient();

interface hrUdates {
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string,
  streetAddress?: string,
  status?: string
  dob?: Date,
  nid?: string,
  gender?: Gender,
}

export const UserService = {
  getUsers: async (
    status?: string,
    dobYear?: string,
    roleId?: string,
    name?: string
  ): Promise<
    {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      orgName: string;
      role: string;
      roleId: string;
      dob: Date;
      phone: string | null;
      status: string;
    }[]
  > => {
    const filters: any = {
      roles: {
        name: 'hr'
      }
    };

    if (status && status !== 'All') {
      filters.status = status.toLowerCase();
    }

    if (dobYear) {
      const startDate = new Date(`${dobYear}-01-01`);
      const endDate = new Date(`${dobYear}-12-31`);
      filters.dob = {
        gte: startDate,
        lte: endDate
      };
    }

    if (roleId && roleId !== 'All') {
      filters.role_id = roleId;
    }

    if (name && name !== 'All') {
      filters.OR = [
        { first_name: { contains: name, mode: 'insensitive' } },
        { last_name: { contains: name, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.users.findMany({
      where: filters,
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
      orgName: user.organizations.name,
      role: user.roles.name,
      roleId: user.role_id,
      dob: user.dob,
      phone: user.phone,
      status: user.status
    }));
  },

  getById: async (id: string) => {
  return await prisma.users.findFirst({
    where: {
      id,
      roles: {
        name: 'hr'
      }
    },
    include: {
      roles: true,
      organizations: true
    }
  });
},

  create: async (data: any, password: string) => {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          first_name: data.firstName!,
          last_name: data.lastName!,
          email: data.email!,
          password_hash: data.password_hash!,
          phone: data.phone,
          nid: data.nid!,
          gender: data.gender!.toUpperCase(),
          dob: new Date(data.dob!),
          role_id: data.role!,
          street_address: data.streetAddress,
          organization_id: data.organizationId!,
        },
      });
      
      const mailOptions = {
      from: mailUser,
      to: data.email,
      subject: `Invitation to Imotrak`,
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
              <img src="${process.env.EMAIL_LOGO_URL}" alt="Imotrak Logo" />
              <h1>Welcome to Imotrak!</h1>
            </div>

            <div class="content">
              <h2>Your account has been created 🎉</h2>
              <p>Hello,</p>
              <p>You have been invited to join the Imotrak platform. Please use the following credentials to log in:</p>

              <div class="info-box">
                <p><strong>Username (email):</strong> ${data.email}</p>
                <p><strong>Temporary Password:</strong> ${password}</p>
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

      console.log('sending email::::::::::::::::::::::::;;;;;;;;')
      await sendEmail(mailOptions).catch((error) => {
        throw new AppError("User not registered due to Email sending failure.");
      });

      return user;
    });
  },

  update: async (id: string, data: hrUdates) =>  {
    const updates: any = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      street_address: data.streetAddress,
      status: data.status,
      nid:data.nid,
      gender: data.gender
    }

    if (data.dob !== undefined) {
      updates.dob = new Date(data.dob);
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: updates
    })

    return updatedUser;
  },

  delete: (id: string) => prisma.users.delete({ where: { id } }),
};
