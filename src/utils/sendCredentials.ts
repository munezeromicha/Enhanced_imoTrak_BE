import { transporter } from './mailer';
import dotenv from 'dotenv';

dotenv.config()

export async function sendForgotPasswordEmail(email: string, password: string) {
  const FRONT_APP = process.env.FRONT_APP;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Password - Imotrak Access Restored',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Password Reset</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(to bottom right, #3b87c5, #d7e9f7);
            color: #003366;
            padding: 40px;
          }
          .container {
            background: white;
            max-width: 600px;
            margin: auto;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 30px;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo img {
            max-height: 60px;
          }
          h2 {
            color: #d84315;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .credentials {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            font-size: 16px;
            border-left: 6px solid #ffc107;
            color: #856404;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #036bb3;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
          }
          .footer {
            margin-top: 30px;
            font-size: 13px;
            text-align: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://i.imgur.com/iY7AdrL.jpeg" alt="Imotrak Logo">
          </div>
          <h2>Password Reset Successful</h2>
          <p class="message">
            You recently requested to reset your password. Here are your updated credentials. Please log in and update your password right away for better security:
          </p>
          <div class="credentials">
            <strong>Email:</strong> ${email}<br>
            <strong>Temporary Password:</strong> ${password}
          </div>
          <a href="${FRONT_APP}" class="button">Log In & Update Password</a>
          <p style="margin-top: 20px;">If you didn’t request this change, please <a href="mailto:support@imotrak.com">contact support</a> immediately.</p>
          <div class="footer">
            &copy; 2025 Imotrak. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendInvitationEmail(
  email: string,
  token: string,
  position: string,
  unit: string,
  organization: string
) {
  console.log('Sending invitation email to:', email, 'with token:', token);
  const FRONT_APP = process.env.FRONT_APP; // e.g., https://app.imotrak.com
  const inviteLink = `${FRONT_APP}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'You’ve Been Invited to Join Imotrak',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>You're Invited to Imotrak</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(to bottom right, #3b87c5, #d7e9f7);
            color: #003366;
            padding: 40px;
          }
          .container {
            background: white;
            max-width: 600px;
            margin: auto;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 30px;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo img {
            max-height: 60px;
          }
          h2 {
            color: #1a5d91;
          }
          .invite-info {
            background-color: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 15px;
            line-height: 1.5;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #036bb3;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
          }
          .manual-link {
            margin-top: 20px;
            font-size: 14px;
            color: #333;
            word-break: break-word;
          }
          .footer {
            margin-top: 30px;
            font-size: 13px;
            text-align: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://i.imgur.com/iY7AdrL.jpeg" alt="Imotrak Logo">
          </div>
          <h2>You’ve Been Invited to Imotrak!</h2>
          <p>You've been invited to join <strong>Imotrak</strong> as a <strong>${position}</strong> in the <strong>${unit}</strong> unit at <strong>${organization}</strong>.</p>

          <div class="invite-info">
            To get started, click the button below to accept your invitation and set up your account.
          </div>

          <a href="${inviteLink}" class="button">Accept Your Invitation</a>

          <div class="manual-link">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${inviteLink}">${inviteLink}</a>
          </div>

          <p style="margin-top: 20px;">Need help? <a href="mailto:support@imotrak.com">Contact our support team</a>.</p>
          <div class="footer">
            &copy; 2025 Imotrak. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
