import request from 'supertest';
import { randomUUID } from 'crypto';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { UserFactory } from 'test/factories/make-user';
import { createAndAuthenticateUser } from 'test/utils/users/create-and-authenticate-user';
import { PostFactory } from 'test/factories/make-post';

describe('Get Post Details Controller (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;
  let postFactory: PostFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);
    postFactory = moduleRef.get(PostFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get details post by id', async () => {
    const { user, accessToken } = await createAndAuthenticateUser({
      userFactory,
      jwt,
    });

    const post = await postFactory.makePrismaPost({
      authorId: user.id,
    });
    await postFactory.makePrismaPost({ authorId: user.id });

    const response = await request(app.getHttpServer())
      .get(`/posts/${post.id.toString()}/details`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.post).toEqual(
      expect.objectContaining({
        author: expect.objectContaining({
          id: user.id.toString(),
        }),
      }),
    );
  });

  it('should not be able get a non-existent post', async () => {
    const { accessToken } = await createAndAuthenticateUser({
      userFactory,
      jwt,
    });

    const postId = randomUUID();

    const response = await request(app.getHttpServer())
      .get(`/posts/${postId}/details`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const { error, message } = response.body;

    expect(response.statusCode).toEqual(400);
    expect(error).toEqual('ResourceNotFoundError');
    expect(message).toEqual('Resource not found');
  });
});
