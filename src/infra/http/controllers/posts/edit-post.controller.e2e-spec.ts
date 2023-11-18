import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { UserFactory } from 'test/factories/make-user';
import { createAndAuthenticateUser } from 'test/utils/users/create-and-authenticate-user';
import { PostFactory } from 'test/factories/make-post';

describe('Edit Post Controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;
  let postFactory: PostFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);
    postFactory = moduleRef.get(PostFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to edit a post', async () => {
    const { user, accessToken } = await createAndAuthenticateUser({
      jwt,
      userFactory,
    });

    const post = await postFactory.makePrismaPost({
      authorId: user.id,
    });

    const response = await request(app.getHttpServer())
      .patch(`/posts/${post.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Title Edited',
      });

    const postEdited = await prisma.post.findUnique({
      where: { id: post.id.toString() },
    });

    expect(response.statusCode).toEqual(204);
    expect(postEdited?.title).toEqual('Title Edited');
  });
});
