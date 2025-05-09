import { Injectable, InternalServerErrorException, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Measurement, MeasurementDocument } from './schemas/measurements.schema';
import { CreateMeasurementDto } from './dto/measurement.dto';


@Injectable()
export class MeasurementsService {
  constructor(
    @InjectModel(Measurement.name) private measurementModel: Model<MeasurementDocument>,
  ) {}

 async create(userId: string, createMeasurementDto: CreateMeasurementDto): Promise<Measurement> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const existing = await this.measurementModel.findOne({
    userId,
    date: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  });

  if (existing) {
    throw new BadRequestException('You can only create one measurement plan per month.');
  }

  const newMeasurement = new this.measurementModel({
    userId,
    ...createMeasurementDto,
  });

  return newMeasurement.save();
}

  async findAllByUserId(userId: string): Promise<Measurement[]> {
    try {
      console.log('Querying for userId:', userId);
      const results = await this.measurementModel.find({ userId }).sort({ date: -1 }).exec();
      console.log('Found results:', results.length);
      return results;
    } catch (error) {
      console.error('Error fetching measurements:', error);
      throw new InternalServerErrorException();
    }
  }

  async findLatestByUserId(userId: string): Promise<Measurement> {
    const measurements = await this.measurementModel
      .find({ userId })
      .sort({ date: -1 })
      .limit(1)
      .exec();
    
    if (measurements.length === 0) {
      throw new NotFoundException(`No measurements found for user with ID ${userId}`);
    }
    
    return measurements[0];
  }

  async findOne(userId: string, id: string): Promise<Measurement> {
    const measurement = await this.measurementModel.findOne({ 
      _id: id, 
      userId 
    }).exec();
    
    if (!measurement) {
      throw new NotFoundException(`Measurement with ID ${id} not found for user ${userId}`);
    }
    
    return measurement;
  }

  async remove(userId: string, id: string): Promise<any> {
    const result = await this.measurementModel.deleteOne({ 
      _id: id, 
      userId 
    }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Measurement with ID ${id} not found for user ${userId}`);
    }
    
    return { deleted: true };
  }
}
