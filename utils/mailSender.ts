import { mailTransporter } from '../src/config/mailer'

interface mailOptions {
    from?: string,
    to: string,
    subject: string,
    html: string
}

const sendEmail = (options: mailOptions ) => mailTransporter.sendMail(options);

export default sendEmail