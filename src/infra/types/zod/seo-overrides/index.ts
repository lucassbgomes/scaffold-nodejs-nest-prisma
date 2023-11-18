import { z } from 'zod';

export const createSeoOverrideSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
});

export const editSeoOverrideSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const paramsSeoOverrideSchema = z.object({
  id: z.string().uuid(),
});

export const queryParamsSeoOverrideSchema = z.object({
  page: z.coerce.number().optional(),
  size: z.coerce.number().optional(),
});

export type CreateSeoOverrideRequest = z.infer<typeof createSeoOverrideSchema>;
export type EditSeoOverrideRequest = z.infer<typeof editSeoOverrideSchema>;

export type SeoOverrideParamsRequest = z.infer<typeof paramsSeoOverrideSchema>;
export type SeoOverrideQueryParamsRequest = z.infer<
  typeof queryParamsSeoOverrideSchema
>;
