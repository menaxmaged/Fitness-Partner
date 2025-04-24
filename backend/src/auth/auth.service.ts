// // src/auth/auth.service.ts
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, password: string): Promise<any> {
//     const user = await this.usersService.findByEmail(email);
//     if (!user) {
//       return null;
//     }

//     // In a real app, compare hashed passwords
//     // const isPasswordValid = await bcrypt.compare(password, user.password);
//     const isPasswordValid = password === user.password; // For compatibility with your current system

//     if (!isPasswordValid) {
//       return null;
//     }

//     return user;
//   }

//   async login(user: any) {
//     const payload = { email: user.email, sub: user.id };
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//         id: user.id,
//         email: user.email,
//         fName: user.fName,
//         lName: user.lName
//       }
//     };
//   }

//   async register(userData: any) {
//     // In a real app, hash the password
//     // const hashedPassword = await bcrypt.hash(userData.password, 10);

//     const newUser = await this.usersService.create({
//       ...userData,
//       // password: hashedPassword
//     });

//     const payload = { email: newUser.email, sub: newUser.id };
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//         id: newUser.id,
//         email: newUser.email,
//         fName: newUser.fName,
//         lName: newUser.lName
//       }
//     };
//   }
// }

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
import { User } from '../users/schemas/user.schema';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private emailService: EmailService,
  ) {}

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

  // Register a new user
  async register(userData: any): Promise<any> {
    // Check if user with this email already exists
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create a new user (unverified)
    const newUser = await this.usersService.create({
      ...userData,
      password: hashedPassword,
      isVerified: false,
    });

    // Handle OTP generation and email sending
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
    const payload = { email: user.email, sub: user.id };
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
    const payload = { email: user.email, sub: user.id };
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
      },
    };
  }
}
