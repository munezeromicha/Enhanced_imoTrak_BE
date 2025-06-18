import { mailTransporter } from '../src/config/mailer'

interface mailOptions {
    from?: string,
    to: string,
    subject: string,
    html: string
}

const sendEmail = (options: mailOptions) => {
    // Add a timeout of 10 seconds to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email sending timeout')), 10000);
    });

    const emailPromise = mailTransporter.sendMail(options);
    
    return Promise.race([emailPromise, timeoutPromise]);
};

export default sendEmail