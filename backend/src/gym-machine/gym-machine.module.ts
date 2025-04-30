// src/gym-machine/gym-machine.module.ts
import { Module } from '@nestjs/common';
import { GymMachineController } from './gym-machine.controller';
import { GeminiService } from '../gemini/gemini.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [GymMachineController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GymMachineModule {}