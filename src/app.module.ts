import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerConfigModule } from './logger/loger.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { CustomExceptionFilter } from './Error/exception-filter';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { validateEnv } from './config/validate-env';
import { UserModule } from './users/user.module';
import { TechniqueModule } from './technique/technique.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, databaseConfig],
      expandVariables: true,
      validate: validateEnv,
    }),
    LoggerConfigModule,
    PrismaModule,
    UserModule,
    TechniqueModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
