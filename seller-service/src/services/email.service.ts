import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import config from '../config';
import logger from '../config/logger';

class EmailService {
    private transporter: Mail;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.email, // Sử dụng host tùy chỉnh hoặc Gmail
            port: config.emailPort, // Cổng mặc định cho SMTP
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.email, // Địa chỉ email của bạn
                pass: config.passEmail, // Mật khẩu email của bạn
            },
            tls: {
                rejectUnauthorized: false, // Để tránh lỗi về chứng chỉ SSL tự ký (self-signed)
            },
        });


        this.transporter.verify((error, success) => {
            if (error) {
                logger.error('Email server connection error: ', error);
            } else {
                logger.info('Email server is ready to send messages');
            }
        });

       
    }
    
    async sendVerificationEmail(to: string, token: string) {
        try {
            const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
            const mailOptions: Mail.Options = {
                from: `"Your App Name" <${process.env.EMAIL_USER}>`, // Tên hiển thị và địa chỉ email người gửi
                to,
                subject: 'Please Verify Your Email Address',
                text: `Hello! Please verify your email by clicking on the following link: ${verificationUrl}`,
                html: `
            <h3>Hello!</h3>
            <p>Please verify your email by clicking on the following link:</p>
            <a href="${verificationUrl}" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Verify Email</a>
            <br>
            <p>If you did not create an account, no further action is required.</p>
            `,
            };
            const info = this.transporter.sendMail(mailOptions) as any
            logger.info(`Verification email sent to ${to}: ${info.messageId}`);
        }
        catch (error) {
            logger.error(`Failed to send verification email to ${to}: `, error);
            throw new Error('Failed to send verification email. Please try again later.');
        }
    }

    async sendEmail(to: string, subject: string, text: string, html: string) {
        try {
            const mailOptions: Mail.Options = {
                from: `"Your App Name" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                text,
                html,
            };

            const info = await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent to ${to}: ${info.messageId}`);
        } catch (error) {
            logger.error(`Failed to send email to ${to}: `, error);
            throw new Error('Failed to send email. Please try again later.');
        }
    }
}

export const emailService = new EmailService();
