import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { Prisma } from '../generated/prisma/client';

@Catch()
@Injectable()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: PinoLogger,
    private readonly config: ConfigService,
  ) {}
  catch(err: unknown, host: ArgumentsHost) {
    const isProd = this.config.get<string>('app.env') === 'production';
    const contextType = host.getType();
    const isHttp = contextType === 'http';
    const unexpectedMessage = 'Unexpected error';

    const request = isHttp
      ? host.switchToHttp().getRequest<Request>()
      : undefined;
    const response = isHttp
      ? host.switchToHttp().getResponse<Response>()
      : undefined;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (err instanceof HttpException) {
      status = err.getStatus();
      message = this.extractHttpExceptionMessage(
        err.getResponse(),
        unexpectedMessage,
      );
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      ({ status, message } = this.mapPrismaError(err));
    } else if (err instanceof Error) {
      message = isProd ? 'Internal server error' : err.message;
    } else {
      message = unexpectedMessage;
    }

    const logPayload = {
      status,
      type: contextType,
      method: request?.method,
      url: request?.url,
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        {
          ...logPayload,
          err: err instanceof Error ? err : undefined,
          stack: err instanceof Error ? err.stack : undefined,
        },
        message,
      );
    } else {
      this.logger.warn(logPayload, message);
    }

    if (!isHttp || !response || !request) {
      return;
    }

    response.status(status).json({
      success: false,
      status,
      message,
      timestamp: new Date().toISOString(),
      url: request.url,
    });
  }

  private extractHttpExceptionMessage(
    response: unknown,
    fallbackMessage: string,
  ): string {
    if (typeof response === 'string') {
      return response;
    }

    if (typeof response !== 'object' || response === null) {
      return fallbackMessage;
    }

    const message = (response as { message?: unknown }).message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return fallbackMessage;
  }

  private mapPrismaError(err: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    if (err.code === 'P2002') {
      const target = (err.meta as { target?: string[] | string } | undefined)
        ?.target;
      const fields = Array.isArray(target)
        ? target.join(', ')
        : typeof target === 'string'
          ? target
          : null;

      return {
        status: HttpStatus.CONFLICT,
        message: fields
          ? `Unique constraint failed on field(s): ${fields}`
          : 'Unique constraint failed',
      };
    }

    if (err.code === 'P2025') {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Record not found',
      };
    }

    return {
      status: HttpStatus.BAD_REQUEST,
      message: err.message,
    };
  }
}
