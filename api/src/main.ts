import { ValidationPipe } from '@nestjs/common'; // used to validate requestbody before send to controller
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import compression from 'compression';

import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true, // disable the request body validation explanation to the frontend in prod
    }),
  );

  app.use(json({ limit: '5mb' }));
  app.use(compression());

  // swagger doc open api
  const config = new DocumentBuilder()
    .setTitle('Common Api')
    .setDescription('Common Api Description')
    .setVersion('1.0')
    .addTag('Common Api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // swagger doc open api

  await app.listen(8000);
}
bootstrap();
