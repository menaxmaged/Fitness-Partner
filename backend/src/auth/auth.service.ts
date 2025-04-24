// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    
    // In a real app, compare hashed passwords
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password === user.password; // For compatibility with your current system
    
    if (!isPasswordValid) {
      return null;
    }
    
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fName: user.fName,
        lName: user.lName
      }
    };
  }

  async register(userData: any) {
    // In a real app, hash the password
    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = await this.usersService.create({
      ...userData,
      // password: hashedPassword
    });
    
    const payload = { email: newUser.email, sub: newUser.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        email: newUser.email,
        fName: newUser.fName,
        lName: newUser.lName
      }
    };
  }
}