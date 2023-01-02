import { UserInfo } from '@lib/auth/user-profile/user-info';
import { CanActivate } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

const fakeAuthUsers = new Map<string, UserInfo>();

const extractAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken();

export const fakeAuthUser = (accessToken: string, info: UserInfo) => {
  fakeAuthUsers.set(accessToken, info);
  return this;
};

export const getFakeAuthUser = (accessToken: string): UserInfo | undefined => {
  return fakeAuthUsers.get(accessToken);
};

export const resetFakeAuthUsers = () => fakeAuthUsers.clear();

export const FakeAuthGuard: CanActivate = {
  canActivate(ctx) {
    const request = ctx.switchToHttp().getRequest();
    const accessToken = extractAccessToken(request);
    return !!accessToken && !!fakeAuthUsers.get(accessToken);
  },
};
