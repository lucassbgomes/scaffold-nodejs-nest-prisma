import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { UserFactory } from 'test/factories/make-user';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { createAndAuthenticateUser } from 'test/utils/users/create-and-authenticate-user';
import { SeoOverrideFactory } from 'test/factories/make-seo-override';

describe('Fetch SeoOverrides Controller (e2e)', () => {
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

  it('should be able to fetch many seo overrides', async () => {
    const { user, accessToken } = await createAndAuthenticateUser({
      jwt,
      userFactory,
    });

    const seoOverrideSize = 3;

    for (let i = 0; i < seoOverrideSize; i++) {
      await seoOverrideFactory.makePrismaSeoOverride({ authorId: user.id });
    }

    const response = await request(app.getHttpServer())
      .get('/seo-overrides')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.seoOverrides.length).toEqual(3);
  });
});
