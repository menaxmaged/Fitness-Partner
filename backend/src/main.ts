import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Debug env loading
const envPath = path.resolve(__dirname, '../.env');


const envResult = dotenv.config({ path: envPath });
if (envResult.error) {
  console.error('Failed to load .env:', envResult.error);
} else {
  console.log('Successfully loaded .env:');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();