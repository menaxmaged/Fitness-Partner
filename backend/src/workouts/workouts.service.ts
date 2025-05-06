import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workout } from './schemas/workout.schema';


@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<Workout>,
  ) {}

  async getAllWorkouts(): Promise<Workout[]> {
    return this.workoutModel.find().exec();
  }

  async findByType(type: string): Promise<Workout[]> {
    return this.workoutModel.find({ day: type }).exec();
  }
  
  async findByPlanType(planType: string): Promise<Workout[]> {
    return this.workoutModel.find({ planType: planType }).exec();
  }
  
  async findByPlanTypeAndDay(planType: string, day: string): Promise<Workout[]> {
    return this.workoutModel.find({ 
      planType: planType,
      day: day 
    }).exec();
  }
}