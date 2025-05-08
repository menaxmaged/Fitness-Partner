import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFlavorDto {
  @ApiProperty({ description: 'Flavor name', example: 'Chocolate' })
  @IsNotEmpty()
  @IsString()
  flavorName: string;
  
  @ApiProperty({ description: 'Quantity for this flavor', example: 50, minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
  
  @ApiProperty({ description: 'Image URL for this flavor', example: '/assets/imgs/chocolate.jpg' })
  @IsNotEmpty()
  @IsString()
  imageUrl: string;
}
