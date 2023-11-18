import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { UserFactory } from 'test/factories/make-user';

type RequestCreateAndAuthenticateUser = {
  userFactory: UserFactory;
  jwt: JwtService;
  role?: UserRole;
};

export async function createAndAuthenticateUser({
  userFactory,
  jwt,
  role = 'CLIENT',
}: RequestCreateAndAuthenticateUser) {
  const user = await userFactory.makePrismaUser({
    firstName: 'John',
    lastName: 'Doe',
    role: role,
  });

  const accessToken = jwt.sign({
    sub: user.id.toString(),
    user: {
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    },
  });

  return {
    user,
    accessToken,
  };
}
