import { Module } from '@nestjs/common';
import { DietGeminiService } from './diet-ai.service';
import { DietGeminiController } from './diet-ai.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [DietGeminiService],
  controllers: [DietGeminiController],
})
export class DietGeminiModule {}
