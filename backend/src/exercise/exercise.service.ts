import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise, ExerciseDocument } from './schema/exercise.schema';

@Injectable()
export class ExerciseService {
  constructor(@InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>) {}

  async findAll(location: string): Promise<Exercise[]> {
    return this.exerciseModel.find({ location }).exec();
  }


  async findById(id: string): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById(id).exec();
    if (!exercise) {
      throw new Error(`Exercise with id ${id} not found`);
    }
    return exercise;
  }
  
  async findOneExercise(location: string, muscle: string, name: string): Promise<Exercise | null> {
     console.log(`Finding exercise with name: ${name}, muscle: ${muscle}, location: ${location}`);
    return this.exerciseModel.findOne({
      location,
      muscle,
      name: { $regex: `^${this.escapeRegex(name)}$`, $options: 'i' }
    }).exec();
  }
  
  escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
  }
  
  async findByMuscle(location: string, muscle: string): Promise<Exercise[]> {
    console.log(`Finding exercises with muscle: ${muscle}`);
    return this.exerciseModel.find({ 
      location,
      muscle: { $regex: new RegExp(`^${this.escapeRegex(muscle)}$`, 'i') }
    }).exec();
  }
}
