import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { UserFactory } from 'test/factories/make-user';
import { createAndAuthenticateUser } from 'test/utils/users/create-and-authenticate-user';

describe('Delete User Controller (e2e)', () => {
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

  it('should be able to delete user by id', async () => {
    const { accessToken } = await createAndAuthenticateUser({
      jwt,
      userFactory,
      role: 'ADMIN',
    });

    const user = await userFactory.makePrismaUser();

    const response = await request(app.getHttpServer())
      .delete(`/users/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const userDeleted = await prisma.user.findUnique({
      where: { id: user.id.toString() },
    });

    expect(response.statusCode).toEqual(204);
    expect(userDeleted).toBeNull();
  });
});
