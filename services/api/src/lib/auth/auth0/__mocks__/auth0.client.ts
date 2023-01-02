import { getFakeAuthUser } from '@fixtures/auth/FakeAuth';
import { UserInfo } from '@lib/auth/user-profile/user-info';
import { UnauthorizedException } from '@nestjs/common';

export const client = {
  async getProfile(token: string): Promise<UserInfo> {
    const info = getFakeAuthUser(token);

    if (!info) {
      throw new UnauthorizedException();
    }

    return info;
  },
};
