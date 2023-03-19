import { AuthInfo } from '@entities/auth';
import { CanActivate, Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { AuthInfoFactory } from '@fixtures/auth/auth-info.factory';
import { User } from '@entities/user.entity';
import { userParamsFromAuth } from '@entities/users.repository';
import { ExecutionContext } from '@nestjs/common';
import { IdentifyService } from '@app/auth/identity/identify.service';
import { ModuleRef } from '@nestjs/core';
import { ExtractJwt } from 'passport-jwt';

export type FakeAuth = {
  accessToken: string;
  authInfo: AuthInfo;
  user: User;
};

const fakeAuthUsers = new Map<string, FakeAuth>();

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
  fakeAuthUsers.set(fakeAuth.accessToken, fakeAuth);
  return fakeAuth;
};

export const getFakeAuthInfo = (accessToken: string): AuthInfo | undefined => {
  return fakeAuthUsers.get(accessToken)?.authInfo;
};

export const resetFakeAuthUsers = () => fakeAuthUsers.clear();

@Injectable()
export class FakeAuthGuard implements CanActivate {
  private identifyService: IdentifyService;

  constructor(moduleRef: ModuleRef) {
    this.identifyService = moduleRef.get(IdentifyService, {
      strict: false,
    });
  }

  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (accessToken) {
      request.user = await this.identifyService.identifyUser(request);
      return true;
    }

    return false;
  }
}
