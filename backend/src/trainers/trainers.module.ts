import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trainer, TrainerSchema } from './schema/trainers.schema';
import { TrainerService } from './trainers.service';
import { TrainerController } from './trainers.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Trainer.name, schema: TrainerSchema }])],
  providers: [TrainerService],
  controllers: [TrainerController],
})
export class TrainerModule {}
