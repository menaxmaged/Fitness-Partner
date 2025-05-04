import { 
  Controller, 
  Get, 
  Param, 
  Delete, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Body, 
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrainerService } from './trainers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { Express } from 'express';
import { IsArray, IsNumber, IsString,ValidateNested,IsNotEmpty } from 'class-validator'; 
import { Type } from 'class-transformer';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  // @Get()
  // @Roles('admin')
  // async getAllTrainers() {
  //   return this.trainerService.findAll();
  // }

  @Get(':id')
  @Roles('admin')
  async getTrainerById(@Param('id') id: string) {
    return this.trainerService.findById(id);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteTrainer(@Param('id') id: string) {
    return this.trainerService.remove(id);
  }

  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  async createTrainer(
  @Body() createTrainerDto: CreateTrainerDto,
  @UploadedFile() image: Express.Multer.File
  ) {
  return this.trainerService.create(createTrainerDto, image);
  }

  @Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
async getAllTrainers() {
  return this.trainerService.findAll();
}

@IsNotEmpty()
@IsString()
bio: string;

Valid

@IsArray()
@ValidateNested({ each: true })
@Type(() => FaqDto)
faq: FaqDto[];


@IsArray()
@ValidateNested({ each: true })
@Type(() => ProductDto)
products: ProductDto[];
}

class FaqDto {
@IsString()
question: string;

@IsString()
answer: string;
}

class ProductDto {
@IsNumber()
id: number;

}
