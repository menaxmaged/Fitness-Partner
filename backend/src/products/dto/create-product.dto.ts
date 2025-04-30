// src/products/dto/create-product.dto.ts
import {
    IsString,
    IsNumber,
    IsOptional,
    IsDateString,
    IsArray,
    IsObject,
  } from 'class-validator';
  
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
    available_flavors: string[];
  
    @IsString()
    available_size: string;
  
    @IsObject()
    product_images: Record<string, string>;
  
    @IsString()
    category: string;
  }


