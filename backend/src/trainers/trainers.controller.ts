import { Controller, Get, Param } from '@nestjs/common';
import { TrainerService } from './trainers.service';

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  async getAllTrainers() {
    return this.trainerService.findAll();
  }

  @Get(':id')
  async getTrainerById(@Param('id') id: string) {
    return this.trainerService.findById(id);
  }
}
