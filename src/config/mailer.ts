import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const mailUser = process.env.MAIL_USER
export const mailTransporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: mailUser,
        pass: process.env.MAIL_PASS
    }
});
