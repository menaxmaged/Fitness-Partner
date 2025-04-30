import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrainerDocument = Trainer & Document;

@Schema()
export class Trainer {
  @Prop()
  id: string;

  @Prop()
  fName: string;

  @Prop()
  lName: string;

  @Prop()
  email: string;

  @Prop()
  mobile: string;

  @Prop()
  gender: string;

  @Prop()
  password: string;

  @Prop({ default: [] })
  orders: any[];

  @Prop({ default: [] })
  cart: any[];

  @Prop()
  isVerified: boolean;

  @Prop()
  createdAt: Date;
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);
