import { transporter } from './mailer';
import dotenv from 'dotenv';

dotenv.config()

export async function sendForgotPasswordEmail(email: string, password: string) {
  const FRONT_APP = process.env.FRONT_APP || process.env.CLIENT_URL || '';
  const loginUrl = FRONT_APP ? `${FRONT_APP.replace(/\/+$/, '')}/login` : '#';
  const year = new Date().getFullYear();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Password - Imotrak Access Restored',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - Imotrak</title>
</head>
<body style="margin:0;padding:0;background-color:#e8f4fc;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#e8f4fc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(8,114,179,0.12);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0872b3 0%,#065d8f 100%);padding:28px 32px;text-align:center;">
              <img src="https://i.imgur.com/iY7AdrL.jpeg" alt="Imotrak" width="120" style="display:block;margin:0 auto 12px;max-height:56px;border:0;" />
              <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#b8d9f0;">Fleet Management</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 8px;">
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">Password reset successful</h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569;">
                You recently requested to reset your Imotrak password. Use the temporary credentials below to sign in, then change your password right away for better security.
              </p>
              <!-- Credentials card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0872b3;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#0872b3;">Your login details</p>
                    <p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:#1e293b;">
                      <span style="display:inline-block;min-width:140px;font-weight:600;color:#334155;">Email</span>
                      <a href="mailto:${email}" style="color:#0872b3;text-decoration:none;font-weight:500;">${email}</a>
                    </p>
                    <p style="margin:0;font-size:15px;line-height:1.5;color:#1e293b;">
                      <span style="display:inline-block;min-width:140px;font-weight:600;color:#334155;vertical-align:top;">Temporary password</span>
                      <span style="display:inline-block;font-family:Consolas,'Courier New',monospace;font-size:16px;font-weight:700;color:#0f172a;background-color:#ffffff;padding:8px 14px;border-radius:6px;border:1px solid #cbd5e1;letter-spacing:0.04em;">${password}</span>
                    </p>
                  </td>
                </tr>
              </table>
              <!-- CTA (inline styles — required for Gmail/Outlook) -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" style="border-radius:8px;background-color:#0872b3;">
                    <a href="${loginUrl}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:700;color:#ffffff !important;text-decoration:none;border-radius:8px;background-color:#0872b3;border:1px solid #065d8f;mso-padding-alt:0;">
                      Log in &amp; update password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#64748b;">
                Button not working? Copy this link into your browser:<br />
                <a href="${loginUrl}" style="color:#0872b3;word-break:break-all;">${loginUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Security notice -->
          <tr>
            <td style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#fff7ed;border:1px solid #fed7aa;border-radius:8px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;font-size:13px;line-height:1.5;color:#9a3412;">
                      <strong style="color:#c2410c;">Didn&apos;t request this?</strong>
                      Contact <a href="mailto:support@imotrak.com" style="color:#0872b3;font-weight:600;">support@imotrak.com</a> immediately so we can secure your account.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#f1f5f9;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">&copy; ${year} Imotrak. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
    text: [
      'Password reset successful - Imotrak',
      '',
      'You requested a password reset. Use these credentials to sign in, then change your password:',
      `Email: ${email}`,
      `Temporary password: ${password}`,
      '',
      `Log in: ${loginUrl}`,
      '',
      "If you didn't request this, contact support@imotrak.com immediately.",
    ].join('\n'),
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
  // Resolve the frontend base URL the same way sendCredentials does. The env
  // uses FRONT_APP; reading CLIENT_URL alone produced "undefined/verify?token=…".
  const FRONT_APP = (process.env.FRONT_APP || process.env.CLIENT_URL || '').replace(/\/+$/, '');
  if (!FRONT_APP) {
    throw new Error(
      'Cannot build invitation link: set FRONT_APP (or CLIENT_URL) in the environment.'
    );
  }
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
            color: #fff;
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

          <a 
            href="${inviteLink}" 
            style="
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              background-color: #036bb3;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              font-size: 16px;
            "
          >
            Accept Your Invitation
          </a>

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
