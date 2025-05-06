import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Workout, WorkoutSchema } from './schemas/workout.schema';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Workout.name, schema: WorkoutSchema }])
  ],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}