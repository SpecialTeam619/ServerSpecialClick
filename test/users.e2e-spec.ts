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

interface CreateUserResponseBody {
  id: string;
  name: string;
  email: string;
}

interface LoginResponseBody {
  access_token: string;
}

interface AuthenticatedUserFixture {
  id: string;
  email: string;
  token: string;
}

describe('UserController (e2e)', () => {
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

  async function createUserAndLogin(): Promise<AuthenticatedUserFixture> {
    const email = `john.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;
    const password = 'password123';
    const httpServer = app.getHttpServer() as import('http').Server;

    const createResponse = await request(httpServer)
      .post('/users')
      .send({
        name: 'John Doe',
        email,
        password,
      })
      .expect(201);

    const userId = (createResponse.body as CreateUserResponseBody).id;

    const loginResponse = await request(httpServer)
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(200);

    const token = (loginResponse.body as LoginResponseBody).access_token;

    return {
      id: userId,
      email,
      token,
    };
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

  it('/POST users', () => {
    const testEmail = `john.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;

    return request(app.getHttpServer() as import('http').Server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: testEmail,
        password: 'password123',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: expect.any(String),
          name: 'John Doe',
          email: testEmail,
        });
      });
  });

  it('/GET users', async () => {
    const { token, email } = await createUserAndLogin();

    return request(app.getHttpServer() as import('http').Server)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          data: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: 'John Doe',
              email,
            }),
          ]),
          meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        });
      });
  });

  it('/GET users/:id', async () => {
    const { id: userId, token, email } = await createUserAndLogin();

    return request(app.getHttpServer() as import('http').Server)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: userId,
          name: 'John Doe',
          email,
        });
      });
  });

  it('/PATCH users/:id', async () => {
    const { id: userId, token, email } = await createUserAndLogin();

    return request(app.getHttpServer() as import('http').Server)
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Smith',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: userId,
          name: 'John Smith',
          email,
        });
      });
  });

  it('/DELETE users/:id', async () => {
    const { id: userId, token, email } = await createUserAndLogin();

    return request(app.getHttpServer() as import('http').Server)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: userId,
          name: 'John Doe',
          email,
        });
      });
  });
});
