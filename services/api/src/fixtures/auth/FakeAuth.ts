import { AuthInfo } from '@entities/auth-info';
import { CanActivate } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { faker } from '@faker-js/faker';
import { AuthInfoFactory } from '@fixtures/auth/auth-info.factory';
import { User } from '@entities/user.entity';
import { userParamsFromAuth } from '@entities/users.repository';

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
  const userParams = userParamsFromAuth(authInfo);
  const user: User = {
    id: `user:${userParams.sub}`,
    name: userParams.name,
    picture: userParams.picture,
  };
  const fakeAuth = {
    accessToken: accessToken ?? faker.datatype.hexadecimal({ length: 12 }),
    authInfo,
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
