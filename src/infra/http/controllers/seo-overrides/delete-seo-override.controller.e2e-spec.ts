import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { UserFactory } from 'test/factories/make-user';
import { createAndAuthenticateUser } from 'test/utils/users/create-and-authenticate-user';
import { SeoOverrideFactory } from 'test/factories/make-seo-override';

describe('Delete Seo Override Controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;
  let seoOverrideFactory: SeoOverrideFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, SeoOverrideFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);
    seoOverrideFactory = moduleRef.get(SeoOverrideFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to delete seo override by id', async () => {
    const { user, accessToken } = await createAndAuthenticateUser({
      jwt,
      userFactory,
    });

    const seoOverride = await seoOverrideFactory.makePrismaSeoOverride({
      authorId: user.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/seo-overrides/${seoOverride.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const seoOverrideDeleted = await prisma.user.findUnique({
      where: { id: seoOverride.id.toString() },
    });

    expect(response.statusCode).toEqual(204);
    expect(seoOverrideDeleted).toBeNull();
  });
});
