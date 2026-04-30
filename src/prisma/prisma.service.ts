import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    const connectionString = configService.getOrThrow<string>('database.url');
    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
    this.logger.setContext(this.constructor.name);
  }
  async onModuleInit() {
    await this.$connect();
    this.logger.info(' V Connected to DB');
  }
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.info(' V Connected to DB');
  }
}
