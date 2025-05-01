import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFlavorQuantityDto {
  @ApiProperty({
    description: 'The flavor name to update quantity for',
    example: 'Chocolate',
  })
  @IsNotEmpty()
  @IsString()
  flavor: string;

  @ApiProperty({
    description: 'The quantity to decrease from inventory',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}