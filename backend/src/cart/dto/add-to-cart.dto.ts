// export class AddToCartDto {
//     productId: string;
//     name: string;
//     image?: string; // Optional (matches your schema)
//     price: number;
//     selectedFlavor?: string; // Optional
//     quantity?: number; // Optional (defaults to 1 in service)
//   }

// src/cart/dto/add-to-cart.dto.ts
// import { IsString, IsNumber, IsOptional } from 'class-validator';

// export class AddToCartDto {
//   @IsString()
//   productId: string;

//   @IsString()
//   name: string;

//   @IsOptional()
//   image?: string;

//   @IsNumber()
//   price: number;

//   @IsOptional()
//   @IsString()
//   selectedFlavor?: string;

//   @IsOptional()
//   @IsNumber()
//   quantity?: number;
// }
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsString()
  selectedFlavor?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;
  
  @IsOptional()
  @IsNumber()
  total?: number;
  
  @IsOptional()
  @IsNumber()
  discount?: number;
  
}