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
}
