import { z } from 'zod';

const nodeEnvSchema = z
  .enum(['development', 'production', 'test'])
  .default('development');

const corsOriginSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => {
      if (!value) {
        return true;
      }

      const origins = value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

      if (origins.length === 0) {
        return false;
      }

      return origins.every((origin) => {
        try {
          new URL(origin);
          return true;
        } catch {
          return false;
        }
      });
    },
    {
      message:
        'CORS_ORIGIN must be a valid URL or valid URLs separated by commas.',
    },
  );

export const envSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: corsOriginSchema,
  JWT_SECRET: z.string().min(1),
});
