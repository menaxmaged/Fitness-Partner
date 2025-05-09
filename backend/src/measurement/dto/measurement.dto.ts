import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateMeasurementDto {
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsNumber()
  @IsNotEmpty()
  waist: number;

  @IsNumber()
  @IsNotEmpty()
  neck: number;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsString()
  @IsNotEmpty()
  dietPlan: string;

  @IsDateString()
  @IsOptional()
  date?: Date;
}