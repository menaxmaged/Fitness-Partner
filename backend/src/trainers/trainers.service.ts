import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trainer, TrainerDocument } from './schema/trainers.schema';
import { Model } from 'mongoose';

@Injectable()
export class TrainerService {
  constructor(@InjectModel(Trainer.name) private trainerModel: Model<TrainerDocument>) {}

  async findAll(): Promise<Trainer[]> {
    return this.trainerModel.find().exec();
  }

  async findById(id: string): Promise<Trainer | null> {
    return this.trainerModel.findOne({ id }).exec();
  }
}
