import { Expose } from 'class-transformer';

export class ProductDto {
  @Expose()
  id: string;  // ID is now a string, not a number

  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose()
  description: string;

  @Expose()
  expiration_date: string;  // Should be a string to match your latest schema

  @Expose()
  price: number;

  @Expose()
  brand: string;

  @Expose()
  available_flavors: string[];  // Array of available flavors

  @Expose()
  available_size: string;  // Size of the product (e.g., "2 lb", "3 lb")

  @Expose()
  product_images: Record<string, string>;  // Mapping of flavors to images

  @Expose()
  category: string;  // Category of the product (e.g., "Protein", "Creatine")

  @Expose()
  discount?: number;  // Optional discount field

  @Expose()
  isHot?: boolean;  // Optional hot status

  @Expose()
  isNew?: boolean;  // Optional new product status

  @Expose()
  quantity: number;  // Total quantity of the product

  @Expose()
  inStock: boolean;  // Whether the product is in stock

  @Expose()
  flavor_quantity: Record<string, number>;  // Mapping of flavor quantities (this is the new field added)
}
