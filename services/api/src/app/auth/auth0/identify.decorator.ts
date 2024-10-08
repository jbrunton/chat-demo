import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@entities/users/user';

export const Identify = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext): Promise<User> => {
    return ctx.switchToHttp().getRequest().user;
  },
);
