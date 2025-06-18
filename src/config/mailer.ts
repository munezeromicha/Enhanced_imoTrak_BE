import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const mailUser = process.env.MAIL_USER

// Check if required environment variables are set
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error('❌ Email configuration error: Missing MAIL_USER or MAIL_PASS environment variables');
    console.error('Please set the following environment variables:');
    console.error('- MAIL_USER: Your email address');
    console.error('- MAIL_PASS: Your email password or app password');
    console.error('- MAIL_SERVICE: Email service (gmail, outlook, etc.)');
}

export const mailTransporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE || 'gmail',
    auth: {
        user: mailUser,
        pass: process.env.MAIL_PASS
    }
});

// Verify mailer configuration only if credentials are available
if (process.env.MAIL_USER && process.env.MAIL_PASS) {
    mailTransporter.verify(function(error, success) {
        if (error) {
            console.error('❌ Mailer configuration error:', error.message);
            console.error('Error code:', (error as any).code);
        } else {
            console.log('✅ Mailer is ready to send emails');
        }
    });
} else {
    console.log('⚠️  Mailer verification skipped due to missing credentials');
}
