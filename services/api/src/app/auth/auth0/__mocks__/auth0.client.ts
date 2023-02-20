import { getFakeAuthInfo } from '@fixtures/auth/FakeAuth';
import { AuthInfo } from '@entities/auth';
import { UnauthorizedException } from '@nestjs/common';

export const clientCache = {
  async getProfile(token: string): Promise<AuthInfo> {
    const authInfo = getFakeAuthInfo(token);

    if (!authInfo) {
      throw new UnauthorizedException();
    }

    return authInfo;
  },
};
