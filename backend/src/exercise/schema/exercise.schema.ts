import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExerciseDocument = Exercise & Document;
@Schema()
export class Exercise {
  @Prop()
  location: string;

  @Prop()
  muscle: string;

  @Prop()
  name: string;

  @Prop()
  videoUrl: string;

  @Prop()
  imageUrl: string;

  @Prop()
  description: string;

  @Prop()
  rating: string;
}


export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
