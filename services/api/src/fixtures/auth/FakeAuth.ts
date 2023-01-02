import { AuthInfo } from '@lib/auth/identity/auth-info';
import { CanActivate } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { faker } from '@faker-js/faker';
import { AuthInfoFactory } from '@fixtures/auth/auth-info.factory';
import {
  User,
  userFromAuthInfo,
} from '@features/messages/entities/user.entity';

export type FakeAuth = {
  accessToken: string;
  authInfo: AuthInfo;
  user: User;
};

const fakeAuthUsers = new Map<string, AuthInfo>();

const extractAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken();

export const fakeAuthUser = (
  accessToken?: string,
  authInfoOverrides?: Partial<AuthInfo>,
): FakeAuth => {
  const authInfo = AuthInfoFactory.build(authInfoOverrides);
  const user = userFromAuthInfo(authInfo);
  const fakeAuth = {
    accessToken: accessToken ?? faker.datatype.hexadecimal({ length: 12 }),
    authInfo: authInfo,
    user,
  };
  fakeAuthUsers.set(fakeAuth.accessToken, fakeAuth.authInfo);
  return fakeAuth;
};

export const getFakeAuthUser = (accessToken: string): AuthInfo | undefined => {
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
