import { AuthorizeParams, AuthService } from '@entities/auth-info';
import { UnauthorizedException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';

export class TestAuthService implements AuthService {
  private proxy = mock<AuthService>();

  async authorize(params: AuthorizeParams): Promise<void> {
    await this.proxy.authorize(params);
  }

  stubFailure(params: Partial<AuthorizeParams>): TestAuthService {
    this.proxy.authorize
      .calledWith(expect.objectContaining(params))
      .mockImplementation(({ message }) =>
        Promise.reject(new UnauthorizedException(message)),
      );
    return this;
  }
}
