import { AuthorizeParams, AuthService } from '@entities/auth';
import { MembershipsRepository } from '@entities/memberships.repository';
import { Injectable } from '@nestjs/common';
import { defineRolesForUser } from './permissions/roles';

@Injectable()
export class CaslAuthService extends AuthService {
  constructor(private readonly membershipsRepo: MembershipsRepository) {
    super();
  }

  async can({
    user,
    subject,
    action,
  }: Omit<AuthorizeParams, 'message'>): Promise<boolean> {
    if (user.id === 'system') {
      return true;
    }

    const memberships = await this.membershipsRepo.getMemberships(user.id);
    const ability = defineRolesForUser(user, memberships);
    return ability.can(action, subject);
  }
}
