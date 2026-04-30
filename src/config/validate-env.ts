import { envSchema } from './env.schema';

export const validateEnv = (config: Record<string, unknown>) => {
  const parsedConfig = envSchema.safeParse(config);

  if (!parsedConfig.success) {
    const issues = parsedConfig.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');

    throw new Error(`Environment validation failed: ${issues}`);
  }

  return parsedConfig.data;
};
