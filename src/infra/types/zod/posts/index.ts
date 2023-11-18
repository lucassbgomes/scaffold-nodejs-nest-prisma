import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  excerpt: z.string(),
  coverImage: z.string(),
  content: z.string(),
  seoOverrideId: z.string().uuid().optional(),
});

export const editPostSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  content: z.string().optional(),
  seoOverrideId: z.string().uuid().optional(),
});

export const paramsPostSchema = z.object({
  id: z.string().uuid(),
});

export const queryParamsPostSchema = z.object({
  page: z.coerce.number().optional(),
  size: z.coerce.number().optional(),
});

export type CreatePostRequest = z.infer<typeof createPostSchema>;
export type EditPostRequest = z.infer<typeof editPostSchema>;

export type PostParamsRequest = z.infer<typeof paramsPostSchema>;
export type PostQueryParamsRequest = z.infer<typeof queryParamsPostSchema>;
