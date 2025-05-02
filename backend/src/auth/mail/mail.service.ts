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

// mail.service.ts - Add new email template
async sendOrderConfirmationEmail(userEmail: string, order: any): Promise<void> {
  // Define template with safe number handling
  const htmlTemplate = (context: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Order Confirmation #${context.order.id}</h2>
      
      <div style="margin-bottom: 20px;">
        <p style="margin: 5px 0;">
          <strong>Date:</strong> 
          ${new Date(context.order.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <h3 style="color: #34495e; border-bottom: 2px solid #ecf0f1; padding-bottom: 5px;">
        Products:
      </h3>
      
      <ul style="list-style: none; padding: 0;">
        ${context.order.products.map((product: any) => {
          // Convert price to number and handle invalid values
          const price = Number(product.price) || 0;
          return `
            <li style="padding: 10px 0; border-bottom: 1px solid #ecf0f1;">
              <div style="display: flex; justify-content: space-between;">
                <div>
                  <strong>${product.name}</strong>
                  ${product.flavor ? `
                    <div style="color: #7f8c8d; font-size: 0.9em;">
                      Flavor: ${product.flavor}
                    </div>
                  ` : ''}
                </div>
                <div>
                  <span style="margin-right: 20px;">Qty: ${product.quantity}</span>
                  <span>$${price.toFixed(2)}</span>
                </div>
              </div>
            </li>
          `;
        }).join('')}
      </ul>

      <div style="text-align: right; margin: 20px 0;">
        <h3 style="color: #34495e;">
          Total: $${Number(context.order.total).toFixed(2)}
        </h3>
      </div>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
        <h3 style="color: #34495e; margin-top: 0;">
          Shipping Address:
        </h3>
        <p style="margin: 5px 0;">${context.order.address.street}</p>
        <p style="margin: 5px 0;">
          ${context.order.address.city}, ${context.order.address.state} ${context.order.address.zipCode}
        </p>
        ${context.order.address.country ? `
          <p style="margin: 5px 0;">${context.order.address.country}</p>
        ` : ''}
      </div>

      <div style="margin-top: 25px; text-align: center; color: #7f8c8d;">
        <p>Thank you for shopping with Fitness Partner!</p>
      </div>
    </div>
  `;

  // Process order data with safe conversions
  const processedOrder = {
    ...order,
    products: order.products.map((p: any) => ({
      ...p,
      price: Number(p.price) || 0,  // Convert to number
      quantity: Number(p.quantity) || 1
    })),
    total: Number(order.total) || 0
  };

  const html = htmlTemplate({
    order: {
      ...processedOrder,
      date: new Date(order.date)
    }
  });

  await this.transporter.sendMail({
    from: '"Fitness Partner" <noreply@fitnesspartner.com>',
    to: userEmail,
    subject: `Your Order #${order.id} Confirmation`,
    html,
  });
}
async sendOrderCancellation(to: string,id:string): Promise<void> {
  const mailOptions = {
    from: 'Fitness Partner <noreply@fitnesspartner.com>', // replace with your email
    to,
    subject: 'Order Cancelation',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e0e0e0;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2c3e50; margin-bottom: 5px;">Fitness Partner</h1>
    <p style="color: #888;">Your fitness journy partner !</p>
  </div>

  <div style="border-top: 2px solid #e74c3c; padding-top: 20px;">
    <h2 style="color: #e74c3c; text-align: center;">Order Cancellation Notice</h2>
    <p style="font-size: 16px; color: #444; line-height: 1.5;">
      We regret to inform you that your order <strong style="color: #c0392b;">#${id}</strong> has been <strong>cancelled</strong>.
    </p>
    <p style="font-size: 15px; color: #666;">
      If you believe this was a mistake or have any questions, please contact our support team for further assistance.
    </p>
  </div>

  <div style="margin-top: 40px; text-align: center;">
    <a href="mailto:support@fitnesspartner.com" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 4px; font-size: 14px;">
      Contact Support
    </a>
  </div>

  <div style="margin-top: 50px; font-size: 12px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
    &copy; ${new Date().getFullYear()} Fitness Partner. All rights reserved.
  </div>
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
}
