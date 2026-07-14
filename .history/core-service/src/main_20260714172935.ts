import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import {
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { join } from 'path';

import { AppConfigService } from './config/config.service';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

import { ValidationError } from 'class-validator';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { formatValidationErrors } from './common/helpers/validation.helper';
import { ErrorCode } from './common/errors/error-codes';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const configService = app.get(AppConfigService);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const formatted = formatValidationErrors(errors);

        return new BadRequestException({
          success: false,
          code: ErrorCode.VALIDATION_FAILED,
          errors: formatted,
        });
      },
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'public'));

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = configService.corsOrigins;

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, swaggerDocument);

  await app.listen(configService.port);

  console.log(`Server running on port ${configService.port}`);
  console.log(`Swagger: http://localhost:${configService.port}/api/docs`);
}

bootstrap();