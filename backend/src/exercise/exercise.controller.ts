// import { Controller, Get, Param, Query } from '@nestjs/common';
// import { ExerciseService } from './exercise.service';

// @Controller()
// export class ExerciseController {
//   constructor(private readonly exerciseService: ExerciseService) {}

//   @Get('home')
//   async getHome(@Query('type') type?: string) {
//     if (type) {
//       return this.exerciseService.findByMuscle('home', type);
//     }
//     return this.exerciseService.findAll('home');
//   }

//   @Get('gym')
//   async getGym(@Query('type') type?: string) {
//     if (type) {
//       return this.exerciseService.findByMuscle('gym', type);
//     }
//     return this.exerciseService.findAll('gym');
//   }

//   @Get('warm')
// async getWarm(@Query('type') type?: string) {
//   if (type) {
//     return this.exerciseService.findByMuscle('warm', type);
//   }
//   return this.exerciseService.findAll('warm');
// }


// @Get('exercise/:id')
// async getExerciseById(@Param('id') id: string) {
//   return this.exerciseService.findById(id);
// }
// }


import { Controller, Get, Query } from '@nestjs/common';
import { ExerciseService } from './exercise.service';

@Controller()
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('home')
  async getHome(
    @Query('muscle') muscle?: string,
    @Query('exercise') exerciseName?: string
  ) {
    if (muscle && exerciseName) {
      return this.exerciseService.findOneExercise('home', muscle, exerciseName);
    }
    if (muscle) {
      return this.exerciseService.findByMuscle('home', muscle);
    }
    return this.exerciseService.findAll('home');
  }

  @Get('gym')
  async getGym(
    @Query('muscle') muscle?: string,
    @Query('exercise') exerciseName?: string
  ) {
    if (muscle && exerciseName) {
      return this.exerciseService.findOneExercise('gym', muscle, exerciseName);
    }
    if (muscle) {
      return this.exerciseService.findByMuscle('gym', muscle);
    }
    return this.exerciseService.findAll('gym');
  }

  @Get('warm')
  async getWarm(
    @Query('muscle') muscle?: string,
    @Query('exercise') exerciseName?: string
  ) {
    if (muscle && exerciseName) {
      return this.exerciseService.findOneExercise('warm', muscle, exerciseName);
    }
    if (muscle) {
      return this.exerciseService.findByMuscle('warm', muscle);
    }
    return this.exerciseService.findAll('warm');
  }
}
