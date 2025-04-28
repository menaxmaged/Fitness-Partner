import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { resetPasswordTemplate } from './reset-password.template';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yousef.hamdy3108@gmail.com',
        pass: 'pxsd ugzd gkxq fwbo',
      },
    });
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    console.log('Attempting to send email to:', email);

    const resetUrl = `http://localhost:4200/resetPassword?token=${token}&email=${email}`;
    console.log('Reset URL:', resetUrl);

    try {
      const mailOptions = {
        from: 'yousef.hamdy3108@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        html: resetPasswordTemplate(resetUrl),
      };

      console.log('Mail options:', mailOptions);

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
    } catch (error) {
      console.error('Detailed email error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
