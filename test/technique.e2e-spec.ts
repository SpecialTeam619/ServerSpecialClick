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

interface CreateTechniqueTypeResponseBody {
  id: string;
}

interface CreateTechniqueResponseBody {
  id: string;
  ownerId: string;
  name: string;
  techniqueTypeId: string;
  techniqueType: { id: string; code: string; name: string };
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

  async function createUserAndLogin(
    role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER',
  ): Promise<{
    id: string;
    phone: string;
    token: string;
  }> {
    const phone = `+7${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const password = 'password123';
    const httpServer = app.getHttpServer() as import('http').Server;

    const createResponse = await request(httpServer)
      .post('/users')
      .send({
        name: 'John Doe',
        phone,
        password,
        role,
      })
      .expect(201);

    const userId = (createResponse.body as CreateUserResponseBody).id;

    const loginResponse = await request(httpServer)
      .post('/auth/login')
      .send({
        phone,
        password,
      })
      .expect(200);

    const token = (loginResponse.body as LoginResponseBody).access_token;

    return {
      id: userId,
      phone,
      token,
    };
  }

  async function createTechnique(token: string) {
    const httpServer = app.getHttpServer() as import('http').Server;
    const name = `Finish project ${Date.now()}`;
    const typePayload = { code: 'CRANE', name: 'Автовышка' };
    const description = 'Implement technique CRUD endpoints';
    const property = ['property1', 'property2'];

    const typeResponse = await request(httpServer)
      .post('/technique-types')
      .set('Authorization', `Bearer ${token}`)
      .send(typePayload)
      .expect(201);

    const techniqueTypeId = (
      typeResponse.body as CreateTechniqueTypeResponseBody
    ).id;

    const response = await request(httpServer)
      .post('/techniques')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name,
        techniqueTypeId,
        description,
        property,
      })
      .expect(201);

    const body = response.body as CreateTechniqueResponseBody;

    return {
      body,
      name,
      techniqueTypeId: body.techniqueTypeId,
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
        techniqueTypeId: '00000000-0000-0000-0000-000000000000',
        description: 'Implement technique CRUD endpoints',
        property: ['property1', 'property2'],
      })
      .expect(401);
  });

  it('/POST techniques', async () => {
    const { id: ownerId, token } = await createUserAndLogin('ADMIN');
    // create technique type first
    const typeResp = await request(app.getHttpServer() as import('http').Server)
      .post('/technique-types')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'CRANE_POST', name: 'Автовышка' })
      .expect(201);

    const techniqueTypeId: string = (
      typeResp.body as CreateTechniqueTypeResponseBody
    ).id;

    return request(app.getHttpServer() as import('http').Server)
      .post('/techniques')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Finish project',
        techniqueTypeId,
        description: 'Implement technique CRUD endpoints',
        property: ['property1', 'property2'],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: expect.any(String),
          ownerId,
          name: 'Finish project',
          techniqueTypeId: techniqueTypeId,
          techniqueType: expect.objectContaining({ name: 'Автовышка' }),
          description: 'Implement technique CRUD endpoints',
          property: ['property1', 'property2'],
        });
      });
  });

  it('/GET techniques', async () => {
    const { id: ownerId, token } = await createUserAndLogin('ADMIN');
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
              techniqueTypeId: createdTechnique.techniqueTypeId,
              techniqueType: expect.objectContaining({
                id: expect.any(String),
              }),
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
    const { id: ownerId, token } = await createUserAndLogin('ADMIN');
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
          techniqueTypeId: createdTechnique.techniqueTypeId,
          techniqueType: expect.objectContaining({ id: expect.any(String) }),
          description: createdTechnique.description,
          property: createdTechnique.property,
        });
      });
  });

  it('/PATCH techniques/:id', async () => {
    const { token } = await createUserAndLogin('ADMIN');
    const createdTechnique = await createTechnique(token);

    return request(app.getHttpServer() as import('http').Server)
      .patch(`/techniques/${createdTechnique.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated name',
        techniqueTypeId: createdTechnique.body.techniqueTypeId,
        description: 'Updated description',
        property: ['Updated property'],
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: createdTechnique.body.id,
          name: 'Updated name',
          techniqueTypeId: createdTechnique.body.techniqueTypeId,
          description: 'Updated description',
          property: ['Updated property'],
        });
      });
  });

  it('/DELETE techniques/:id', async () => {
    const { token } = await createUserAndLogin('ADMIN');
    const createdTechnique = await createTechnique(token);

    return request(app.getHttpServer() as import('http').Server)
      .delete(`/techniques/${createdTechnique.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: createdTechnique.body.id,
          name: createdTechnique.name,
          techniqueTypeId: createdTechnique.body.techniqueTypeId,
          description: createdTechnique.description,
          property: createdTechnique.property,
        });
      });
  });
});
