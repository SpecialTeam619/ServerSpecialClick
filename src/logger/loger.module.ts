import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { createLoggerConfig } from './logger.config';

@Global()
@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createLoggerConfig(configService),
    }),
  ],
  exports: [LoggerModule],
})
export class LoggerConfigModule {}
