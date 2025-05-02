import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { DietGeminiService } from './diet-ai.service';
import { Response } from 'express';

@Controller('diet-plan')
export class DietGeminiController {
  constructor(private readonly dietService: DietGeminiService) {}

  @Post()
  async createPlan(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.dietService.generateDietPlan(body);
      return res.status(HttpStatus.OK).send(result); // return plain text
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error generating diet plan');
    }
  }
}
