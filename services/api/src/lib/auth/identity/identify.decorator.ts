import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { client } from '@lib/auth/auth0/auth0.client';
import { AuthInfo } from './auth-info';

const extractAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken();

export const Identify = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext): Promise<AuthInfo | null> => {
    const request = ctx.switchToHttp().getRequest();
    const accessToken = extractAccessToken(request);

    if (!accessToken) return null;

    return await client.getProfile(accessToken);
  },
);
