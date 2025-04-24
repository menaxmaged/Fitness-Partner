import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: Types.ObjectId })
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  declare id: string;
  

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  expiration_date: Date;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  brand: string;

  @Prop([String])
  available_flavors: string[];

  @Prop({ required: true })
  available_size: string;

  @Prop({ type: Map, of: String })
  product_images: Map<string, string>;

  @Prop({ required: true })
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = Product & Document;