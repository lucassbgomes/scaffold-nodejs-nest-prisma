export type UserEntityRole = 'ADMIN' | 'MANAGER' | 'SUPPORT' | 'CLIENT';

export type UserEntityData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: UserEntityRole;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

export type UserEntityProps = UserEntityData;

export type UserEntityResponseData = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserEntityRole;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};
