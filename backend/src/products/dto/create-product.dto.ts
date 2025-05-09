// src/products/dto/create-product.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  IsObject,
  IsBoolean,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsDateString()
  expiration_date: Date;

  @IsNumber()
  price: number;

  @IsString()
  brand: string;

  @IsArray()
  @IsString({ each: true })
  available_flavors: string[];

  @IsString()
  available_size: string;

  @IsObject()
  product_images: Record<string, string>;

  @IsObject()
  flavor_quantity: Record<string, number>;

  @IsString()
  category: string;

  @IsBoolean()
  inStock: boolean;

  @IsOptional()
  @IsBoolean()
  isHot?: boolean;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsNumber()
  discount?: number;
}
