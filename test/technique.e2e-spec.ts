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
}

interface LoginResponseBody {
  access_token: string;
}

interface CreateTechniqueResponseBody {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  property: string[];
}

describe('TechniqueController (e2e)', () => {
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

  async function createUserAndLogin(): Promise<{
    id: string;
    email: string;
    token: string;
  }> {
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

  async function createTechnique(token: string) {
    const httpServer = app.getHttpServer() as import('http').Server;
    const name = `Finish project ${Date.now()}`;
    const description = 'Implement technique CRUD endpoints';
    const property = ['property1', 'property2'];

    const response = await request(httpServer)
      .post('/techniques')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name,
        description,
        property,
      })
      .expect(201);

    const body = response.body as CreateTechniqueResponseBody;

    return {
      body,
      name,
      description,
      property,
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

  it('/POST thechnique without token', () => {
    return request(app.getHttpServer() as import('http').Server)
      .post('/techniques')
      .send({
        name: 'Finish project',
        description: 'Implement technique CRUD endpoints',
        property: ['property1', 'property2'],
      })
      .expect(401);
  });

  it('/POST techniques', async () => {
    const { id: ownerId, token } = await createUserAndLogin();

    return request(app.getHttpServer() as import('http').Server)
      .post('/techniques')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Finish project',
        description: 'Implement technique CRUD endpoints',
        property: ['property1', 'property2'],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: expect.any(String),
          ownerId,
          name: 'Finish project',
          description: 'Implement technique CRUD endpoints',
          property: ['property1', 'property2'],
        });
      });
  });

  it('/GET techniques', async () => {
    const { id: ownerId, token } = await createUserAndLogin();
    const createdTechnique = await createTechnique(token);

    return request(app.getHttpServer() as import('http').Server)
      .get('/techniques')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          data: expect.arrayContaining([
            expect.objectContaining({
              id: createdTechnique.body.id,
              ownerId,
              name: createdTechnique.name,
              description: createdTechnique.description,
              property: createdTechnique.property,
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

  it('/GET techniques/:id', async () => {
    const { id: ownerId, token } = await createUserAndLogin();
    const createdTechnique = await createTechnique(token);

    return request(app.getHttpServer() as import('http').Server)
      .get(`/techniques/${createdTechnique.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: createdTechnique.body.id,
          ownerId,
          name: createdTechnique.name,
          description: createdTechnique.description,
          property: createdTechnique.property,
        });
      });
  });

  it('/PATCH techniques/:id', async () => {
    const { token } = await createUserAndLogin();
    const createdTechnique = await createTechnique(token);

    return request(app.getHttpServer() as import('http').Server)
      .patch(`/techniques/${createdTechnique.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated name',
        description: 'Updated description',
        property: ['Updated property'],
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: createdTechnique.body.id,
          name: 'Updated name',
          description: 'Updated description',
          property: ['Updated property'],
        });
      });
  });

  it('/DELETE techniques/:id', async () => {
    const { token } = await createUserAndLogin();
    const createdTechnique = await createTechnique(token);

    return request(app.getHttpServer() as import('http').Server)
      .delete(`/techniques/${createdTechnique.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: createdTechnique.body.id,
          name: createdTechnique.name,
          description: createdTechnique.description,
          property: createdTechnique.property,
        });
      });
  });
});
