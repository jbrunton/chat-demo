import { Room } from './room.entity';
import { User } from './user.entity';

export interface AuthInfo {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  nickname?: string;
  picture?: string;
  locale?: string;
  updated_at?: number | string;
  email?: string;
  email_verified?: boolean;
}

export enum Role {
  Read = 'read',
  Write = 'write',
  Manage = 'manage',
}

export type AuthorizeParams = {
  user: User;
  subject: Room | User;
  action: Role;
  message?: string;
};

export abstract class AuthService {
  abstract authorize(params: AuthorizeParams): Promise<void>;
  abstract can(params: Omit<AuthorizeParams, 'message'>): Promise<boolean>;
  abstract authorizedRoles(
    params: Omit<AuthorizeParams, 'message' | 'action'>,
  ): Promise<Role[]>;
}
