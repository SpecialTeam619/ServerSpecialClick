import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export function createLoggerConfig(configService: ConfigService): Params {
  const appEnv = configService.get<string>('app.env') ?? 'development';
  const isDevelopment = appEnv === 'development';

  return {
    pinoHttp: {
      level: isDevelopment ? 'debug' : 'error',
      transport: isDevelopment
        ? {
            targets: [
              {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'yyyy-mm-dd HH:MM:ss',
                  ignore: 'pid,hostname',
                },
              },
              {
                target: 'pino-roll',
                options: {
                  file: 'logs/app.log',
                  frequency: 'daily', // Ротация каждый день
                  mkdir: true, // Создаст папку logs если её нет
                  size: '10M', // Или ротация при достижении 10MB
                  dateFormat: 'yyyy-MM-dd',
                  extension: '.log', // Расширение файла
                },
              },
            ],
          }
        : undefined,

      genReqId: (req) => {
        return req.headers['x-request-id'] || randomUUID();
      },
      //стилизаторы преобразуют сложный объект в простой
      serializers: {
        err: (
          err:
            | {
                name?: string;
                type?: string;
                message?: string;
                stack?: string;
                code?: string | number;
              }
            | null
            | undefined,
        ) => ({
          type: err?.name || err?.type,
          message: err?.message,
          stack: err?.stack,
          code: err?.code,
        }),
        req: (req: {
          id?: string;
          method?: string;
          url?: string;
          params?: unknown;
          query?: unknown;
        }) => ({
          id: req.id,
          method: req.method,
          url: req.url,
          params: req.params,
          query: req.query,
        }),
        res: (res: { statusCode?: number }) => ({
          statusCode: res.statusCode,
        }),
      },
      autoLogging: {
        ignore: (req) => !isDevelopment || req.url === '/health',
      },
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
    },
  };
}
