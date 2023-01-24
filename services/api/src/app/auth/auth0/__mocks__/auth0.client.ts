import { getFakeAuthInfo } from '@fixtures/auth/FakeAuth';
import { AuthInfo } from '@entities/auth-info';
import { UnauthorizedException } from '@nestjs/common';

export const client = {
  async getProfile(token: string): Promise<AuthInfo> {
    const authInfo = getFakeAuthInfo(token);

    if (!authInfo) {
      throw new UnauthorizedException();
    }

    return authInfo;
  },
};
