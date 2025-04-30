import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private geminiProVisionModel: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // this.geminiProVisionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    this.geminiProVisionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  }

  async identifyGymMachine(
    imageBuffer: Buffer,
    prompt: string = 'What is this gym machine? Respond only with the equipment name with the exercise can be played with description, no formatting, no extra words.',
    mimeType: string = 'image/jpeg'
  ): Promise<string> {
    try {
      const base64Image = imageBuffer.toString('base64');

      const result = await this.geminiProVisionModel.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
        console.error('❌ Gemini API Error:', JSON.stringify(error, null, 2));
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to identify gym machine');
      }
  }
}


// src/gemini/gemini.service.ts
// import { Injectable } from '@nestjs/common';
// import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
// import { ConfigService } from '@nestjs/config';
// import * as fs from 'fs/promises';
// import { base64Encode } from '../utils/base64-encode'; // Assuming you have this utility

// @Injectable()
// export class GeminiService {
//   private geminiProVisionModel: GenerativeModel;

//   constructor(private configService: ConfigService) {
//     const apiKey = this.configService.get<string>('GEMINI_API_KEY');
//     if (!apiKey) {
//       throw new Error('GEMINI_API_KEY is not defined in the environment variables');
//     }
//     const genAI = new GoogleGenerativeAI(apiKey);
//     this.geminiProVisionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
// }

//   async identifyGymMachine(imageBuffer: Buffer, prompt: string = 'What is this gym machine?') {
//     try {
//       const base64Image = imageBuffer.toString('base64');
//     //   const mimeType = 'image/jpg'; 
//     const mimeType = image.mimetype; 
//       const result = await this.geminiProVisionModel.generateContent([
//         prompt,
//         {
//           inlineData: {
//             data: base64Image,
//             mimeType,
//           },
//         },
//       ]);
//       const response = await result.response;
//       const text = response.text();
//       return text;
//     } catch (error) {
//       console.error('Error identifying gym machine:', error);
//       console.error('Detailed Gemini API Error:', error);
//       throw new Error('Failed to identify gym machine');
//     }
//   }
// }