// export class UpdateUserDto {
//   readonly fName?: string;
//   readonly lName?: string;
//   readonly mobile?: string;
//   readonly gender?: string;
//   readonly email?: string;
//   readonly password?: string;
//   isVerified?: boolean;
// }
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fName?: string;

  @IsOptional()
  @IsString()
  lName?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}