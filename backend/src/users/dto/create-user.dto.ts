// // src/users/dto/create-user.dto.ts
// export class CreateUserDto {
//   fName: string;
//   lName: string;
//   email: string;
//   password: string;
//   avatar?: string;
//   isVerified?: boolean;
//   role?: 'user' | 'trainer' | 'admin';
// }

import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fName: string;

  @IsString()
  lName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  // role?: 'user' | 'trainer' | 'admin';
}
