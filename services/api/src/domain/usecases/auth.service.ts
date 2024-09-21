import { User } from '@entities/users/user';
import { Logger } from './logger';
import { UnauthorizedException } from '@nestjs/common';
import { isNil, reject } from 'rambda';
import { Room } from '@entities/room.entity';

export enum Role {
  Read = 'read',
  Write = 'write',
  Manage = 'manage',
  Join = 'join',
}

export type AuthorizeParams = {
  user: User;
  subject: Room | User;
  action: Role;
  message?: string;
};

/**
 * Base AuthService.
 */
export abstract class AuthService {
  constructor(private readonly logger: Logger) {}

  /**
   * Authorises a user on a subject with an action.
   * @param {AuthorizeParams} params The user, subject, action and optionally failure message
   */
  async authorize({ user, subject, action, message }: AuthorizeParams) {
    const hasRole = await this.can({ user, action, subject });
    if (!hasRole) {
      this.logger.log(
        `User (id=${user.id}) unauthorized for action '${action}' on subject (id=${subject.id})`,
      );
      throw new UnauthorizedException(message ?? defaultMessage);
    }
  }

  abstract can({
    user,
    subject,
    action,
  }: Omit<AuthorizeParams, 'message'>): Promise<boolean>;

  async authorizedRoles({
    user,
    subject,
  }: Omit<AuthorizeParams, 'message' | 'action'>): Promise<Role[]> {
    const actions: Role[] = [Role.Read, Role.Write, Role.Manage, Role.Join];
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
