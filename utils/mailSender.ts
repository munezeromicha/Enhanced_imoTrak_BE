import { mailTransporter } from '../src/config/mailer'

interface mailOptions {
    from?: string,
    to: string,
    subject: string,
    html: string
}

const sendEmail = async (options: mailOptions) => {
    try {
        // Add a timeout of 15 seconds to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Email sending timeout after 15 seconds')), 15000);
        });

        const emailPromise = mailTransporter.sendMail(options);
        
        const result = await Promise.race([emailPromise, timeoutPromise]);
        console.log('✅ Email sent successfully to:', options.to);
        return result;
    } catch (error: any) {
        console.error('❌ Email sending failed:', error.message);
        if (error.code === 'ECONNECTION') {
            console.error('Connection error - please check your email service configuration');
        }
        // Don't throw the error to prevent the application from crashing
        // Just log it and return null to indicate failure
        return null;
    }
};

export default sendEmail