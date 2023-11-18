import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { UserFactory } from 'test/factories/make-user';

describe('Refresh Token User Controller (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to refresh a token', async () => {
    await userFactory.makePrismaUser({
      email: 'test@example.com',
      password: await hash('123456', 8),
    });

    const authResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        username: 'test@example.com',
        password: '123456',
      });

    const cookies = authResponse.get('Set-Cookie');

    const response = await request(app.getHttpServer())
      .post('/sessions/refresh-token')
      .set('Authorization', `Bearer ${authResponse.body.access_token}`)
      .set('Cookie', cookies)
      .send();

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refresh_token='),
    ]);
  });
});
