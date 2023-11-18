import { z } from 'zod';

import { UserEntityRole } from '@/domain/website/enterprise/entities/user/user.types';

export const userRoleSchema: z.ZodType<UserEntityRole> = z.enum([
  'ADMIN',
  'MANAGER',
  'SUPPORT',
  'CLIENT',
]);

export const registerUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: userRoleSchema.default('CLIENT'),
});

export const editUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  role: userRoleSchema.optional(),
});

export const paramsUserSchema = z.object({
  id: z.string().uuid(),
});

export const queryParamsUserSchema = z.object({
  page: z.coerce.number().optional(),
  size: z.coerce.number().optional(),
});

export type EditUserRequest = z.infer<typeof editUserSchema>;

export type UserParamsRequest = z.infer<typeof paramsUserSchema>;
export type UserQueryParamsRequest = z.infer<typeof queryParamsUserSchema>;
