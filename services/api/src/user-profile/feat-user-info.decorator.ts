import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import fetch from 'node-fetch';

export const FetchUserInfo = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    const response = await fetch('https://jbrunton.eu.auth0.com/userinfo', {
      headers: {
        authorization,
      },
    });
    const userinfo = await response.json();
    return userinfo;
  },
);
