import { Module } from '@nestjs/common';
import { CustomExceptionFilter } from './exception-filter';

@Module({
  providers: [CustomExceptionFilter],
  exports: [CustomExceptionFilter],
})
export class CustomExceptionFilterModule {}
