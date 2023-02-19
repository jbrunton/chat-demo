import { subject } from '@casl/ability';
import { AuthorizeParams, AuthService } from '@entities/auth-info';
import { MembershipsRepository } from '@entities/memberships.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { defineRolesForUser } from './permissions/roles';

@Injectable()
export class CaslAuthService implements AuthService {
  constructor(private readonly membershipsRepo: MembershipsRepository) {}

  async authorize({ user, room, action, message }: AuthorizeParams) {
    const memberships = await this.membershipsRepo.getMemberships(user.id);
    const ability = defineRolesForUser(user, memberships);
    if (!ability.can(action, subject('Room', room))) {
      throw new UnauthorizedException(message ?? defaultMessage);
    }
  }
}

const defaultMessage = 'You do not have permission to perform this action.';
