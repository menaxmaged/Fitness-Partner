import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { Workout } from './schemas/workout.schema';


@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  getAll() {
    return this.workoutsService.getAllWorkouts();
  }

  @Get('day/:type')
  findByDay(@Param('type') type: string) {
    return this.workoutsService.findByType(type);
  }
  
  @Get('plan/:planType')
  findByPlanType(@Param('planType') planType: string) {
    return this.workoutsService.findByPlanType(planType);
  }
  
  @Get('filter')
  findByPlanTypeAndDay(
    @Query('planType') planType: string,
    @Query('day') day: string
  ) {
    if (planType && day) {
      return this.workoutsService.findByPlanTypeAndDay(planType, day);
    } else if (planType) {
      return this.workoutsService.findByPlanType(planType);
    } else if (day) {
      return this.workoutsService.findByType(day);
    } else {
      return this.workoutsService.getAllWorkouts();
    }
  }
}