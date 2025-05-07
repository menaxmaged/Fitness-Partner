import { 
  Controller, 
  Get, 
  Param, 
  Delete, 
  Post, 
  Put,
  UseInterceptors, 
  UploadedFile, 
  Body, 
  UseGuards,
  Req,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrainerService } from './trainers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Express } from 'express';

@Controller('trainers')
export class TrainerController {
  private readonly logger = new Logger(TrainerController.name);
  
  constructor(private readonly trainerService: TrainerService) {}
  
  @Get()
  async getAllTrainers() {
    return this.trainerService.findAll();
  }

  @Get(':id')
  async getTrainerById(@Param('id') id: string) {
    return this.trainerService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async deleteTrainer(@Param('id') id: string, @Req() req) {
    this.logger.log(`User ${req.user?.username} is deleting trainer with ID: ${id}`);
    return this.trainerService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  async createTrainer(
    @Body() createTrainerDto: CreateTrainerDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req
  ) {
    this.logger.log(`User ${req.user?.username} is creating a new trainer`);
    return this.trainerService.create(createTrainerDto, image);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  async updateTrainer(
    @Param('id') id: string,
    @Body() updateData: any,
    @UploadedFile() image: Express.Multer.File,
    @Req() req
  ) {
    this.logger.log(`User ${req.user?.username} is updating trainer with ID: ${id}`);
    
    // Parse faq and products if they're strings (from FormData)
    if (updateData.faq && typeof updateData.faq === 'string') {
      try {
        updateData.faq = JSON.parse(updateData.faq);
      } catch (e) {
        this.logger.error(`Error parsing FAQ data: ${e.message}`);
      }
    }
    
    if (updateData.products && typeof updateData.products === 'string') {
      try {
        updateData.products = JSON.parse(updateData.products);
      } catch (e) {
        this.logger.error(`Error parsing products data: ${e.message}`);
      }
    }
    
    return this.trainerService.update(id, updateData, image);
  }
}