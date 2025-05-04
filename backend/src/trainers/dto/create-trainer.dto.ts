import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTrainerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsString()
  specialty: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  faq?: { question: string; answer: string }[];

  @IsOptional()
  products?: { id: string }[];
}