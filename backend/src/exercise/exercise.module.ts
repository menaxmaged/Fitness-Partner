import { MongooseModule } from '@nestjs/mongoose';
import { Exercise, ExerciseSchema } from './schema/exercise.schema';
import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema }])],
  providers: [ExerciseService],
  controllers: [ExerciseController],
})
export class ExerciseModule {}
