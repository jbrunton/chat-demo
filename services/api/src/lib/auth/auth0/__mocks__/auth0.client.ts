import { getFakeAuthUser } from '@fixtures/auth/FakeAuth';
import { AuthInfo } from '@lib/auth/identity/auth-info';
import { UnauthorizedException } from '@nestjs/common';

export const client = {
  async getProfile(token: string): Promise<AuthInfo> {
    const info = getFakeAuthUser(token);

    if (!info) {
      throw new UnauthorizedException();
    }

    return info;
  },
};
