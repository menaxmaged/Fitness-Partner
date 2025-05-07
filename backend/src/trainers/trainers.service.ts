import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trainer, TrainerDocument } from './schema/trainers.schema';
import { Model } from 'mongoose';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { saveTrainerImage } from '../utils/file-upload.util';

@Injectable()
export class TrainerService {
  private readonly logger = new Logger(TrainerService.name);
  
  constructor(@InjectModel(Trainer.name) private trainerModel: Model<TrainerDocument>) {}

  async findAll(): Promise<Trainer[]> {
    return this.trainerModel.find().exec();
  }

  async findById(id: string): Promise<Trainer | null> {
    return this.trainerModel.findOne({ id }).exec();
  }
  
  async remove(id: string): Promise<Trainer> {
    this.logger.log(`Attempting to delete trainer with ID: ${id}`);
    const deletedTrainer = await this.trainerModel.findOneAndDelete({ id }).exec();
    if (!deletedTrainer) {
      this.logger.warn(`Trainer with ID ${id} not found for deletion`);
      throw new NotFoundException(`Trainer with ID "${id}" not found`);
    }
    this.logger.log(`Successfully deleted trainer with ID: ${id}`);
    return deletedTrainer;
  }
  
  async create(createTrainerDto: CreateTrainerDto, image: Express.Multer.File): Promise<Trainer> {
    try {
      // Find the highest ID by sorting in descending order
      const trainers = await this.trainerModel.find().sort({ id: -1 }).limit(1).exec();
      
      // Calculate the next ID (converting from string to number and back)
      let nextId = "1"; // Default if no trainers exist
      if (trainers.length > 0) {
        // Parse the current highest ID and increment it
        const currentHighestId = parseInt(trainers[0].id, 10);
        nextId = (currentHighestId + 1).toString();
      }

      // Verify the ID isn't already in use to prevent duplicates
      const existingTrainer = await this.trainerModel.findOne({ id: nextId }).exec();
      if (existingTrainer) {
        // If the ID is already taken, find the truly highest ID in the collection
        const allTrainers = await this.trainerModel.find().exec();
        const allIds = allTrainers.map(trainer => parseInt(trainer.id, 10));
        const highestId = Math.max(...allIds, 0); // Use 0 as fallback if array is empty
        nextId = (highestId + 1).toString();
      }

      // Save image and get path
      const imagePath = saveTrainerImage(image, nextId);
      
      // Create a trainer object with only the fields we want
      const trainerData = {
        id: nextId,
        name: createTrainerDto.name,
        bio: createTrainerDto.bio,
        image: imagePath,
        // Default to empty arrays if not provided
        faq: createTrainerDto.faq || [],
        products: createTrainerDto.products || []
      };
      
      this.logger.log(`Creating new trainer with ID: ${nextId}`);
      const newTrainer = new this.trainerModel(trainerData);
      return await newTrainer.save();
    } catch (error) {
      // Handle potential duplicate key errors
      if (error.code === 11000 && error.keyPattern && error.keyPattern.id) {
        this.logger.error(`Duplicate trainer ID detected: ${error.message}`);
        throw new ConflictException(`Trainer with ID already exists. Try again.`);
      }
      this.logger.error(`Error creating trainer: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateData: any, image?: Express.Multer.File): Promise<Trainer> {
    this.logger.log(`Updating trainer with ID: ${id}`);
    
    // First check if the trainer exists
    const trainer = await this.trainerModel.findOne({ id }).exec();
    if (!trainer) {
      this.logger.warn(`Trainer with ID ${id} not found for update`);
      throw new NotFoundException(`Trainer with ID "${id}" not found`);
    }

    // Prepare update data
    const updateFields: any = {};
    
    // Only add fields that are provided in the update data
    if (updateData.name) updateFields.name = updateData.name;
    if (updateData.bio) updateFields.bio = updateData.bio;
    
    // Handle FAQ data properly
    if (updateData.faq) {
      // Ensure faq is an array
      if (Array.isArray(updateData.faq)) {
        updateFields.faq = updateData.faq;
      } else {
        this.logger.warn(`Invalid FAQ data format for trainer ${id}`);
      }
    }
    
    // Handle products data properly
    if (updateData.products) {
      // Ensure products is an array
      if (Array.isArray(updateData.products)) {
        updateFields.products = updateData.products;
      } else {
        this.logger.warn(`Invalid products data format for trainer ${id}`);
      }
    }
    
    // Handle image update if provided
    if (image) {
      const imagePath = saveTrainerImage(image, id);
      updateFields.image = imagePath;
    }
    
    this.logger.debug(`Update fields: ${JSON.stringify(updateFields)}`);
    
    // Update the trainer and return the updated document
    const updatedTrainer = await this.trainerModel.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true } // Return the updated document
    ).exec();
    
    if (!updatedTrainer) {
      this.logger.warn(`Failed to update trainer with ID ${id}`);
      throw new NotFoundException(`Failed to update trainer with ID "${id}"`);
    }
    
    this.logger.log(`Successfully updated trainer with ID: ${id}`);
    return updatedTrainer;
  }
}