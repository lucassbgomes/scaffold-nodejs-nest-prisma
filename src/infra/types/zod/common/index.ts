import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';
import { z } from 'zod';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

export const pageQueryValidationPipe = new ZodValidationPipe(
  pageQueryParamSchema,
);

export type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const sizeQueryParamSchema = z
  .string()
  .optional()
  .default('20')
  .transform(Number)
  .pipe(z.number().min(5));

export const sizeQueryValidationPipe = new ZodValidationPipe(
  sizeQueryParamSchema,
);

export type SizeQueryParamSchema = z.infer<typeof sizeQueryParamSchema>;
