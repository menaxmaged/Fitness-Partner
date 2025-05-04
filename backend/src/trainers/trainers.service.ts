import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trainer, TrainerDocument } from './schema/trainers.schema';
import { Model } from 'mongoose';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TrainerService {
  constructor(@InjectModel(Trainer.name) private trainerModel: Model<TrainerDocument>) {}

  async findAll(): Promise<Trainer[]> {
    return this.trainerModel.find().exec();
  }

  async findById(id: string): Promise<Trainer | null> {
    return this.trainerModel.findOne({ id }).exec();
  }

  
  async remove(id: string): Promise<Trainer> {
    const deletedTrainer = await this.trainerModel.findOneAndDelete({ id }).exec();
    if (!deletedTrainer) {
      throw new NotFoundException(`Trainer with ID "${id}" not found`);
    }
    return deletedTrainer;
  }
  

  async create(createTrainerDto: CreateTrainerDto, image: Express.Multer.File): Promise<Trainer> {
    const newTrainer = new this.trainerModel({
      ...createTrainerDto,
      id: uuidv4(),
      image: image?.path || 'default-trainer.jpg',
      rating: 0,
      createdAt: new Date(),
      isVerified: true
    });
    
    return newTrainer.save();
  }

}
