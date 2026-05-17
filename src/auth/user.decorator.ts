import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

type UserPayload = Record<string, unknown> | undefined;

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: UserPayload }>();
    const user = req.user;
    return user;
  },
);
