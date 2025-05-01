import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import { User } from '../users/schemas/user.schema';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { EmailService } from '../email/email.service';
import { MailService } from './mail/mail.service';
import { Token } from './entities/token.entity';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { environment } from '../environment';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private mailService: MailService,
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private emailService: EmailService,
  ) {}

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        // Return success message even if user doesn't exist (security best practice)
        return { message: 'If the email exists, a reset link has been sent' };
      }

      // Delete any existing tokens
      await this.tokenModel.deleteMany({ userId: user._id });

      // Create reset token
      const token = crypto.randomBytes(32).toString('hex');
      await this.tokenModel.create({
        userId: user._id,
        token,
      });

      await this.mailService.sendResetPasswordEmail(user.email, token);
      return { message: 'If the email exists, a reset link has been sent' };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new InternalServerErrorException(
        'Failed to process password reset request',
      );
    }
  }

  // async googleAuth(googleAuthDto: GoogleAuthDto): Promise<any> {
  //   try {
  //     // Verify the Google access token (you might want to use Google's API to verify)
  //     // For simplicity, we'll trust the token for now

  //     // Check if user exists
  //     let user = await this.usersService.findByEmail(googleAuthDto.email);

  //     if (!user) {
  //       // Create new user
  //       user = await this.usersService.create({
  //         email: googleAuthDto.email,
  //         fName: googleAuthDto.firstName,
  //         lName: googleAuthDto.lastName,
  //         isVerified: true, // Google-authenticated users are considered verified
  //         password: crypto.randomBytes(16).toString('hex'), // Random password since they'll use Google auth
  //       });
  //     }

  //     // Generate JWT token
  //     const payload = { email: user.email, sub: user.id, role: user.role };
  //     const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

  //     return {
  //       message: 'Google authentication successful',
  //       access_token,
  //       user: {
  //         id: user.id,
  //         email: user.email,
  //         fName: user.fName,
  //         lName: user.lName,
  //         isVerified: user.isVerified,
  //         role: user.role,
  //       },
  //     };
  //   } catch (error) {
  //     console.error('Google auth error:', error);
  //     throw new InternalServerErrorException('Google authentication failed');
  //   }
  // }

  // In auth.service.ts, update the googleAuth method:

  async googleAuth(googleAuthDto: GoogleAuthDto): Promise<any> {
    try {
      // Verify the Google token using Google's API
      const googleUser = await this.verifyGoogleToken(
        googleAuthDto.accessToken,
      );

      if (!googleUser || googleUser.email !== googleAuthDto.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      // Check if user exists
      let user = await this.usersService.findByEmail(googleAuthDto.email);

      if (!user) {
        // Create new user
        user = await this.usersService.create({
          email: googleAuthDto.email,
          fName: googleAuthDto.firstName,
          lName: googleAuthDto.lastName,
          isVerified: true,
          password: crypto.randomBytes(16).toString('hex'),
          authProvider: 'google', // Add this field to track auth provider
        });
      }

      // Generate JWT token
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
        provider: 'google',
      };
      const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

      return {
        message: 'Google authentication successful',
        access_token,
        user: {
          id: user.id,
          email: user.email,
          fName: user.fName,
          lName: user.lName,
          isVerified: user.isVerified,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('Google auth error:', error);
      throw new InternalServerErrorException('Google authentication failed');
    }
  }

  private async verifyGoogleToken(token: string): Promise<any> {
    try {
      const { OAuth2Client } = require('google-auth-library');
      const client = new OAuth2Client(environment.googleClientId);

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: environment.googleClientId,
      });

      return ticket.getPayload();
    } catch (error) {
      console.error('Google token verification failed:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async resetPassword(
    token: string,
    email: string,
    password: string,
  ): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new Error('Invalid email');

    const resetToken = await this.tokenModel.findOne({
      userId: user._id,
      token,
    });
    if (!resetToken) throw new Error('Invalid or expired token');

    // Update password
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    // Delete token
    await this.tokenModel.deleteMany({ userId: user._id });
  }

  // Helper method to generate a 6-digit OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Helper method to handle OTP generation and email sending
  private async handleOtp(email: string): Promise<void> {
    try {
      // Delete any existing OTP
      await this.otpModel.deleteMany({ email });

      // Generate and save new OTP
      const otp = this.generateOtp();
      await this.otpModel.create({ email, otp });

      // Send OTP email
      await this.emailService.sendOtpEmail(email, otp);
    } catch (error) {
      throw new InternalServerErrorException('Failed to send OTP');
    }
  }

  async register(userData: any): Promise<any> {
    try {
      const existingUser = await this.usersService.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = await this.usersService.create({
        ...userData,
        password: hashedPassword,
        isVerified: false,
      });

      await this.handleOtp(userData.email);

      return {
        message: 'User registered successfully. Please verify your email.',
        user: {
          id: newUser.id,
          email: newUser.email,
          fName: newUser.fName,
          lName: newUser.lName,
        },
      };
    } catch (error) {
      console.error('Error in register:', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string): Promise<any> {
    // Find OTP record
    const otpRecord = await this.otpModel.findOne({ email, otp });
    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP or OTP expired');
    }

    // Find and update user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.isVerified = true;
    const updatedUser = await this.usersService.update(user.id, {
      isVerified: true,
    });
    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }

    // Delete used OTP
    await this.otpModel.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    ////////////////////////// Last Edit //////////////////////////
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      message: 'Email verified successfully',
      access_token,
      user: {
        id: user.id,
        email: user.email,
        fName: user.fName,
        lName: user.lName,
        isVerified: user.isVerified,
        role: user.role,
      },
    };
  }

  // Resend OTP
  async resendOtp(email: string): Promise<any> {
    // Check if user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Handle OTP generation and email sending
    await this.handleOtp(email);

    return { message: 'OTP resent successfully' };
  }

  // Login user
  async login(email: string, password: string): Promise<any> {
    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Handle OTP generation and email sending
      await this.handleOtp(email);

      return {
        message: 'Email not verified. A new verification code has been sent.',
        requiresVerification: true,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      message: 'Login successful',
      access_token,
      user: {
        id: user.id,
        email: user.email,
        fName: user.fName,
        lName: user.lName,
        isVerified: user.isVerified,
        role: user.role,
      },
    };
  }
}
