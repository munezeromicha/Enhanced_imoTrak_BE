import { transporter } from './mailer';

export async function sendUserCredentialsEmail(email: string, password: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Account Credentials',
    text: `Welcome! Your login credentials are:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password immediately.`,
  };

  await transporter.sendMail(mailOptions);
}
