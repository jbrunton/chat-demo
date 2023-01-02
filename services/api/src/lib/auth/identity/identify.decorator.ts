import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { client } from '@lib/auth/auth0/auth0.client';
import {
  User,
  userFromAuthInfo,
} from '@features/messages/entities/user.entity';

const extractAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken();

export const Identify = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext): Promise<User | null> => {
    const request = ctx.switchToHttp().getRequest();
    const accessToken = extractAccessToken(request);

    if (!accessToken) return null;

    const authInfo = await client.getProfile(accessToken);
    return authInfo ? userFromAuthInfo(authInfo) : null;
  },
);
