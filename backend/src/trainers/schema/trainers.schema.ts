import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrainerDocument = Trainer & Document;

@Schema()
export class Faq {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;
}

@Schema()
export class Product {
  @Prop({ required: true })
  id: number;
}

@Schema()
export class Trainer {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  bio: string;

  @Prop({ default: '/assets/trainers-imgs/default.jpg' })
  image: string;

  @Prop({ type: [{ question: String, answer: String }], default: [] })
  faq: Faq[];

  @Prop({ type: [{ id: Number }], default: [] })
  products: Product[];
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);