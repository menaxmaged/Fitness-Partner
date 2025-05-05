import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsBoolean, IsIn, IsArray, ValidateNested } from 'class-validator';

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

  @IsOptional()
  @IsIn(['user', 'trainer', 'admin'], {
    message: 'Role must be either user, trainer, or admin',
  })
  role?: 'user' | 'trainer' | 'admin';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];
}
export class AddressDto {
  @IsString({ message: 'Street must be a string' })
  street: string;

  @IsString({ message: 'City must be a string' })
  city: string;

  @IsString({ message: 'State must be a string' })
  state: string;

  @IsString({ message: 'Zip code must be a string' })
  zipCode: string;

  @IsString({ message: 'Country must be a string' })
  country: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}