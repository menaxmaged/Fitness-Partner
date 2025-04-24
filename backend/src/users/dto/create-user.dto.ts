// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  fName: string;
  lName: string;
  email: string;
  password: string;
  avatar?: string;
  isVerified?: boolean;
}
