import { AuthorizeParams, AuthService, Role } from '@entities/auth';
import { MembershipsRepository } from '@entities/memberships.repository';
import { isNil, reject } from 'rambda';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { defineRolesForUser } from './permissions/roles';

@Injectable()
export class CaslAuthService extends AuthService {
  constructor(private readonly membershipsRepo: MembershipsRepository) {
    super();
  }

  async authorize({ user, subject, action, message }: AuthorizeParams) {
    const hasRole = await this.can({ user, action, subject });
    if (!hasRole) {
      throw new UnauthorizedException(message ?? defaultMessage);
    }
  }

  async can({
    user,
    subject,
    action,
  }: Omit<AuthorizeParams, 'message'>): Promise<boolean> {
    const memberships = await this.membershipsRepo.getMemberships(user.id);
    const ability = defineRolesForUser(user, memberships);
    return ability.can(action, subject);
  }

  async authorizedRoles({
    user,
    subject,
  }: Omit<AuthorizeParams, 'message' | 'action'>): Promise<Role[]> {
    const actions: Role[] = [Role.Read, Role.Write, Role.Manage];
    const roles = await Promise.all(
      actions.map(async (action) => {
        const hasRole = await this.can({ user, subject, action });
        return hasRole ? action : undefined;
      }),
    );
    return reject(isNil)(roles);
  }
}

const defaultMessage = 'You do not have permission to perform this action.';
