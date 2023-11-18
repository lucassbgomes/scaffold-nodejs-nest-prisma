import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { UserFactory } from 'test/factories/make-user';
import { createAndAuthenticateUser } from 'test/utils/users/create-and-authenticate-user';

describe('Edit User Controller (e2e)', () => {
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

  it('should be able to edit a user', async () => {
    const { user, accessToken } = await createAndAuthenticateUser({
      jwt,
      userFactory,
      role: 'ADMIN',
    });

    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        lastName: 'Edit',
      });

    const userEdited = await prisma.user.findUnique({
      where: { id: user.id.toString() },
    });

    expect(response.statusCode).toEqual(204);
    expect(userEdited?.lastName).toEqual('Edit');
  });
});
