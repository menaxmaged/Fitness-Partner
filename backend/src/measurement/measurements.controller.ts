import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/measurement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('users/:userId/measurements')
@UseGuards(JwtAuthGuard)
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  create(
    @Param('userId') userId: string,
    @Body() createMeasurementDto: CreateMeasurementDto,
    @Request() req,
  ) {
    // Ensure the user can only create measurements for themselves
    if (req.user.userId !== userId) {
      throw new UnauthorizedException('You can only manage your own measurements');
    }
    return this.measurementsService.create(userId, createMeasurementDto);
  }

  @Get()
  findAll(@Param('userId') userId: string, @Request() req) {
    // Ensure the user can only access their own measurements
    if (req.user.userId !== userId) {
      throw new UnauthorizedException('You can only access your own measurements');
    }
    return this.measurementsService.findAllByUserId(userId);
  }

  @Get('latest')
  findLatest(@Param('userId') userId: string, @Request() req) {
    // Ensure the user can only access their own measurements
    if (req.user.userId !== userId) {
      throw new UnauthorizedException('You can only access your own measurements');
    }
    return this.measurementsService.findLatestByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('userId') userId: string, @Param('id') id: string, @Request() req) {
    // Ensure the user can only access their own measurements
    if (req.user.userId !== userId) {
      throw new UnauthorizedException('You can only access your own measurements');
    }
    return this.measurementsService.findOne(userId, id);
  }

  @Delete(':id')
  remove(@Param('userId') userId: string, @Param('id') id: string, @Request() req) {
    // Ensure the user can only delete their own measurements
    if (req.user.userId !== userId) {
      throw new UnauthorizedException('You can only delete your own measurements');
    }
    return this.measurementsService.remove(userId, id);
  }
}