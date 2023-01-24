import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@entities/user.entity';

export const Identify = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext): Promise<User> => {
    return ctx.switchToHttp().getRequest().user;
  },
);
