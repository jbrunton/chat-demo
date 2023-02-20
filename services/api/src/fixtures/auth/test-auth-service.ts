import { AuthorizeParams, AuthService, Role } from '@entities/auth';
import { UnauthorizedException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';

export class TestAuthService implements AuthService {
  private proxy = mock<AuthService>();

  async authorize(params: AuthorizeParams): Promise<void> {
    await this.proxy.authorize(params);
  }

  async can(params: Omit<AuthorizeParams, 'message'>): Promise<boolean> {
    return this.proxy.can(params);
  }

  async authorizedRoles(
    params: Omit<AuthorizeParams, 'message' | 'action'>,
  ): Promise<Role[]> {
    return this.proxy.authorizedRoles(params);
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
