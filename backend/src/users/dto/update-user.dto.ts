export class UpdateUserDto {
  readonly fName?: string;
  readonly lName?: string;
  readonly mobile?: string;
  readonly gender?: string;
  readonly email?: string;
  readonly avatar?: string;
  isVerified?: boolean;
}