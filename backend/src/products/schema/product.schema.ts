import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product {

  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;

  @Prop()
  expiration_date: Date;

  @Prop()
  price: number;

  @Prop()
  brand: string;

  @Prop([String])
  available_flavors: string[];

  @Prop()
  available_size: string;

  @Prop({ type: Map, of: String })
  product_images: Record<string, string>;

  @Prop()
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = Product & Document;
