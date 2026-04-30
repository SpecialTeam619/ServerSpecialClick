import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('ping')
  ping(): { pong: string; timestamp: string } {
    return { pong: 'pong', timestamp: new Date().toISOString() };
  }
}
