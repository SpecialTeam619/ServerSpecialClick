import { PrismaClient } from '../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IPrismaService } from './prisma.interface';

@injectable()
export class PrismaService implements IPrismaService {
    client: PrismaClient;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const connectionString = `${process.env.DATABASE_URL}`;
        const adapter = new PrismaPg({ connectionString });
        this.client = new PrismaClient({ adapter });
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log(
                '[PrismaService] Успешно подключились к базе данных',
            );
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(
                    '[PrismaService] Ошибка подключения к базе данных: ' +
                        error.message,
                );
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}
