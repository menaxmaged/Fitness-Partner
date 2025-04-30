// // src/gym-machine/gym-machine.controller.ts
// import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { GeminiService } from '../gemini/gemini.service';

// @Controller('gym-machine')
// export class GymMachineController {
//   constructor(private readonly geminiService: GeminiService) {}

//   @Post('identify')
//   @UseInterceptors(FileInterceptor('image'))
//   async identify(@UploadedFile() image: Express.Multer.File) {
//     if (!image) {
//       return { error: 'Please upload an image.' };
//     }
//     console.log('Received image:', image.originalname, image.mimetype, image.size);

//     // return await this.geminiService.identifyGymMachine(image.buffer);
//     try {
//         return await this.geminiService.identifyGymMachine(image.buffer);
//       } catch (error) {
//         console.error('Gemini error:', error);
//         return { error: 'Failed to identify image' };
//       }
//   }
// }



import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeminiService } from '../gemini/gemini.service';

@Controller('gym-machine')
export class GymMachineController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('identify')
  @UseInterceptors(FileInterceptor('image', {
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async identify(@UploadedFile() image: Express.Multer.File) {
    if (!image) {
      return { error: 'Please upload an image.' };
    }

    try {
      return await this.geminiService.identifyGymMachine(
        image.buffer,
        'What is this gym machine?',
        image.mimetype
      );
    } catch (error) {
      console.error('Gemini error:', error);
      return { error: 'Failed to identify image.' };
    }
  }
}
