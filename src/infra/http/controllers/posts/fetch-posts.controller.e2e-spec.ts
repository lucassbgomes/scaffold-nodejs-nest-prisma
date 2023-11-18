import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { UserFactory } from 'test/factories/make-user';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { createAndAuthenticateUser } from 'test/utils/users/create-and-authenticate-user';
import { PostFactory } from 'test/factories/make-post';

describe('Fetch Posts Controller (e2e)', () => {
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

  it('should be able to fetch many posts', async () => {
    const { user, accessToken } = await createAndAuthenticateUser({
      jwt,
      userFactory,
    });

    const postSize = 3;

    for (let i = 0; i < postSize; i++) {
      await postFactory.makePrismaPost({ authorId: user.id });
    }

    const response = await request(app.getHttpServer())
      .get('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.posts.length).toEqual(3);
  });
});
