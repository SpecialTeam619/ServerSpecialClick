import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

@Controller('test-prisma')
export class TestPrismaControler {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('test')
  async prismaTest1() {
    console.log('start');
    try {
      console.log('connect...');
      await this.prismaService.$connect();
    } catch (e) {
      console.log(e);
    }
  }
}
