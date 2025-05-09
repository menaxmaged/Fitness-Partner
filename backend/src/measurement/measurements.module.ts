import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { Measurement, MeasurementSchema } from './schemas/measurements.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Measurement.name, schema: MeasurementSchema },
    ]),
  ],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
  exports: [MeasurementsService],
})
export class MeasurementsModule {}