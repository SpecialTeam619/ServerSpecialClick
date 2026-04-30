import { Module } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

@Module({
  controllers: [TestPrismaModule],
  providers: [PrismaService],
})
export class TestPrismaModule {}
