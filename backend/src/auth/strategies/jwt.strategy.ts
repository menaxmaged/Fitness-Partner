// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private configService: ConfigService) {
//     const secretOrKey = configService.get<string>('JWT_SECRET');
//     if (!secretOrKey) {
//       throw new Error('JWT_SECRET is not defined in the configuration');
//     }
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey,
//     });
//   }

//   async validate(payload: any) {
//     return { userId: payload.sub, email: payload.email };
//   }
// }

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secretOrKey = configService.get<string>('JWT_SECRET');
    if (!secretOrKey) {
      throw new Error('JWT_SECRET is not defined in the configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

// jwt.strategy.ts
async validate(payload: any) {
  const user = await this.usersService.findById(payload.sub);
  if (!user) {
    throw new UnauthorizedException();
  }
  
  // Add debug logging 🚨
  console.log('Authenticated user:', {
    userId: user.id,
    role: user.role,
    dbRole: user.role // Confirm this matches database
  });

  return { 
    userId: user.id, 
    email: user.email, 
    role: user.role // Must exactly match "admin"
  };
}
}




