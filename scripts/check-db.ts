import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

async function main() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter });

    try {
        const users = await prisma.user.findMany({ take: 1 });
        console.log('users ok', users.length);
    } catch (error) {
        const err = error as Error & { code?: string };
        console.error('NAME:', err.constructor.name);
        console.error('MESSAGE:', err.message);
        console.error('CODE:', err.code);
    } finally {
        await prisma.$disconnect();
    }
}

main();
