import request from 'supertest';
import { randomUUID } from 'crypto';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { UserFactory } from 'test/factories/make-user';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { createAndAuthenticateUser } from 'test/utils/users/create-and-authenticate-user';

describe('Get User By ID Controller (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user by id', async () => {
    const { user, accessToken } = await createAndAuthenticateUser({
      userFactory,
      jwt,
    });

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to get user by id inexistent', async () => {
    const { accessToken } = await createAndAuthenticateUser({
      userFactory,
      jwt,
    });

    const userId = randomUUID();

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const { error, message } = response.body;

    expect(response.statusCode).toEqual(400);
    expect(error).toEqual('ResourceNotFoundError');
    expect(message).toEqual('Resource not found');
  });
});
