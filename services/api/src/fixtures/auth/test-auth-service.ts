import { AuthorizeParams, AuthService } from '@entities/auth';
import { equals } from 'rambda';

type Permission = Omit<AuthorizeParams, 'message'>;

export class TestAuthService extends AuthService {
  private permissions: Permission[] = [];

  async can(params: Permission): Promise<boolean> {
    return this.permissions.some((permission) => equals(permission, params));
  }

  stubPermission(permission: Permission): TestAuthService {
    this.permissions.push(permission);
    return this;
  }
}
