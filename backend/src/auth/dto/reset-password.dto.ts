import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  IsEmail,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password too weak',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
