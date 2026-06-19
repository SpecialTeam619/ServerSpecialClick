import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required for seeding');
}

const staticBaseUrl =
  process.env.STATIC_BASE_URL ??
  `http://localhost:${process.env.PORT ?? '3333'}`;

const techniqueTypes = [
  {
    id: '1dabdb1a-9bd4-444e-8a8a-e8115d21eba6',
    code: 'TOW TRUCK',
    name: 'Эвакуатор',
    description: 'Подходит для перевозки легковых автомобилей и спецтехники.',
    photoUrl: `${staticBaseUrl}/static/tow_truck.png`,
    isActive: true,
  },
  {
    id: '8f2c4b11-6de1-4f0a-9c44-2a8f5d90b7e1',
    code: 'AERIAL PLATFORM',
    name: 'Автовышка',
    description: 'Подходит для высотных работ, монтажа и обслуживания фасадов.',
    photoUrl: `${staticBaseUrl}/static/aerial_platform.png`,
    isActive: true,
  },
] as const;

async function main() {
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  for (const techniqueType of techniqueTypes) {
    await prisma.techniqueType.upsert({
      where: { code: techniqueType.code },
      update: {
        name: techniqueType.name,
        description: techniqueType.description,
        photoUrl: techniqueType.photoUrl,
        isActive: techniqueType.isActive,
      },
      create: techniqueType,
    });
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Database seed failed:', error);
  process.exit(1);
});
