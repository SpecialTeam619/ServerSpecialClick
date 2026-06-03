import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface UserPayload {
  sub: string;
  email: string;
  name?: string;
  role: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export const User = createParamDecorator<keyof UserPayload | undefined>(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: UserPayload }>();
    const user = request.user;

    console.log('User decorator called. User payload:', user);

    if (!user) {
      return undefined;
    }

    // Если передан ключ — возвращаем только это поле
    if (data && data in user) {
      return user[data];
    }

    // Иначе возвращаем весь объект пользователя
    return user;
  },
);
