import { z } from 'zod';

export const authenticateUserSchema = z.object({
  username: z.string().min(1),
  password: z.string(),
});

export type AuthenticateUserBodySchema = z.infer<typeof authenticateUserSchema>;
