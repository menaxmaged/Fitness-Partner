import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MeasurementDocument = Measurement & Document;

@Schema({ timestamps: true })
export class Measurement {
  @Prop({ ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  waist: number;

  @Prop({ required: true })
  neck: number;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  goal: string;

  @Prop({ required: true })
  dietPlan: string;

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const MeasurementSchema = SchemaFactory.createForClass(Measurement);