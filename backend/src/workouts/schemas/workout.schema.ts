import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Exercise {
  @Prop({ required: true })
  name: string;
  
  @Prop({ required: true })
  sets: number;
  
  @Prop({ required: true })
  reps: string;
  
  @Prop()
  notes: string;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

@Schema()
export class Workout extends Document {
  @Prop({ required: true })
  day: string;  // 'push', 'pull', 'legs', 'chest', 'back', etc.
  
  @Prop({ required: true })
  muscleGroup: string;
  
  @Prop({ type: [ExerciseSchema], required: true })
  exercises: Exercise[];
  
  @Prop({ 
    required: true,
    enum: ['push-pull-legs', 'bro-split', 'upper-lower']
  })
  planType: string;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout);