import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  // Configure environment variables
  const envPath = path.resolve(__dirname, '../.env');
  const envResult = dotenv.config({ path: envPath });

  const logger = new Logger('Bootstrap');

  // Environment configuration diagnostics
  if (envResult.error) {
    logger.error('Failed to load .env:', envResult.error);
  } else {
    logger.log(`Environment loaded from ${envPath}`);
    logger.debug('PORT:', process.env.PORT);
    logger.debug(
      'MONGODB_URI:',
      process.env.MONGODB_URI?.substring(0, 25) + '...',
    );
  }

  // Create NestJS application
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Global validation setup
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     exceptionFactory: (errors) => {
  //       console.error('Validation Errors:', JSON.stringify(errors, null, 2));
  //       return new BadRequestException(errors);
  //     },
  //   }),
  // );

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Start application
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application running on: http://localhost:${port}`);
  logger.debug(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
