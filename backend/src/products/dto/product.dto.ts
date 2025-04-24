import { Expose, Transform } from 'class-transformer';

export class ProductDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose()
  description: string;

  @Expose()
  expiration_date: Date;

  @Expose()
  price: number;

  @Expose()
  brand: string;

  @Expose()
  available_flavors: string[];

  @Expose()
  available_size: string;

  @Expose()
  @Transform(({ value }) => Object.fromEntries(value))
  product_images: Record<string, string>;

  @Expose()
  category: string;
}