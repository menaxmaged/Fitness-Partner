// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
async register(@Body() registerData: any) {
  // Check if user already exists
  const existingUser = await this.usersService.findByEmail(registerData.email);
  if (existingUser) {
    throw new HttpException('Email already exists', HttpStatus.CONFLICT);
  }
  
  return this.authService.register(registerData);
}
}