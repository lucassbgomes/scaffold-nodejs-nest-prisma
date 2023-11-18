import request from 'supertest';
import { randomUUID } from 'crypto';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { UserFactory } from 'test/factories/make-user';
import { createAndAuthenticateUser } from 'test/utils/users/create-and-authenticate-user';
import { SeoOverrideFactory } from 'test/factories/make-seo-override';

describe('Get Seo Override By ID Controller (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;
  let seoOverrideFactory: SeoOverrideFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, SeoOverrideFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);
    seoOverrideFactory = moduleRef.get(SeoOverrideFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get seo override by id', async () => {
    const { user, accessToken } = await createAndAuthenticateUser({
      userFactory,
      jwt,
    });

    const seoOverride = await seoOverrideFactory.makePrismaSeoOverride({
      authorId: user.id,
    });
    await seoOverrideFactory.makePrismaSeoOverride({ authorId: user.id });

    const response = await request(app.getHttpServer())
      .get(`/seo-overrides/${seoOverride.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.seoOverride).toEqual(
      expect.objectContaining({
        id: seoOverride.id.toString(),
      }),
    );
  });

  it('should not be able get a non-existent seo override', async () => {
    const { accessToken } = await createAndAuthenticateUser({
      userFactory,
      jwt,
    });

    const seoOverrideId = randomUUID();

    const response = await request(app.getHttpServer())
      .get(`/seo-overrides/${seoOverrideId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const { error, message } = response.body;

    expect(response.statusCode).toEqual(400);
    expect(error).toEqual('ResourceNotFoundError');
    expect(message).toEqual('Resource not found');
  });
});
