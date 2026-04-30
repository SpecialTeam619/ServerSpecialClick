import { registerAs } from '@nestjs/config';

function parseCorsOrigin(corsOriginRaw: string | undefined): string[] | true {
  if (!corsOriginRaw) {
    return true;
  }

  const origins = corsOriginRaw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : true;
}

export default registerAs('app', () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
}));
