import request from 'supertest';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  async function clearDatabase() {
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename <> '_prisma_migrations'
    `;

    if (tables.length === 0) {
      return;
    }

    const quotedTables = tables
      .map(({ tablename }) => `"public"."${tablename.replace(/"/g, '""')}"`)
      .join(', ');

    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${quotedTables} RESTART IDENTITY CASCADE;`,
    );
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await app.close();
  });
  it('/POST register', () => {
    const testEmail = `john.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;

    return request(app.getHttpServer() as import('http').Server)
      .post('/auth/register')
      .send({
        name: 'John Doe',
        email: testEmail,
        password: 'password123',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          access_token: expect.any(String),
        });
      });
  });
});
