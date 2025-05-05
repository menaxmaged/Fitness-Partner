import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Configure the email transporter
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: parseInt('587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'yousef.hamdy3108@gmail.com', // replace with your email
        pass: 'ceax mbel icej ggtn', // replace with your app password
      },
    });
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from: '"Fitness Partner" yousef.hamdy3108@gmail.com', // replace with your email
      to,
      subject: 'Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p>Thank you for registering! Before we get started, please verify your email address.</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
              ${otp}
            </div>
          </div>
          <p>This verification code will expire in 10 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
            &copy; ${new Date().getFullYear()} Your App. All rights reserved.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error.message, error.stack);
      throw new Error('Failed to send email: ' + error.message);
    }
  }
  async sendOrderCancellation(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from: 'Fitness Partner', // replace with your email
      to,
      subject: 'Order Cancelation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p>We are sorry to tell you that your order has been cancelled</p>
          <p>Please contact us if you have any questions.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
            &copy; ${new Date().getFullYear()} Fitness Partner. All rights reserved.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error.message, error.stack);
      throw new Error('Failed to send email: ' + error.message);
    }
  }

  async sendContactEmail(name: string, email: string, message: string): Promise<void> {
    const mailOptions = {
      from: `"${name}" <${email}>`, // use user's name and email as the "from"
      to: 'tadros.work@gmail.com',
      subject: 'New Contact Us Message',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
          <h2 style="text-align: center;">Contact Us Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
      replyTo: email, // ensures replies go to the user
    };
  
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending contact email:', error.message, error.stack);
      throw new Error('Failed to send contact email: ' + error.message);
    }
  }
  
}
