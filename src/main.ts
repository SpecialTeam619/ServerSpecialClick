import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = new DocumentBuilder()
    .setTitle('Todo List API')
    .setDescription('The Todo List backend API documentation')
    .setVersion('1.0')
    .addTag('todos')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory());

  //validateDTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //pinoLoger
  const logger = app.get(Logger);
  app.useLogger(logger);

  //ConfigService
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('app.port');
  const corsOrigin =
    configService.get<string[] | true>('app.corsOrigin') ?? true;

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  await app.listen(port);

  logger.log(`NestJS backend running on http://localhost:${port}`);

  return app;
}

export const boot = bootstrap();
