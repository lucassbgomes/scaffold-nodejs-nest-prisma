import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { UserFactory } from 'test/factories/make-user';
import { createAndAuthenticateUser } from 'test/utils/users/create-and-authenticate-user';
import makeSeoOverride from 'test/factories/make-seo-override';

describe('Create Seo Override Controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a seo override', async () => {
    const { user, accessToken } = await createAndAuthenticateUser({
      jwt,
      userFactory,
    });

    const { title, description, image } = makeSeoOverride({
      authorId: user.id,
    });

    const response = await request(app.getHttpServer())
      .post('/seo-overrides')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title,
        description,
        image,
      });

    const seoOverride = await prisma.seoOverride.findFirst({
      where: { authorId: user.id.toString() },
    });

    expect(response.statusCode).toEqual(201);
    expect(seoOverride?.authorId).toEqual(user.id.toString());
  });
});
