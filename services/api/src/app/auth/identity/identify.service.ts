import { AuthInfo } from '@entities/auth-info';
import { User } from '@entities/user.entity';
import {
  userParamsFromAuth,
  UsersRepository,
} from '@entities/users.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { client } from '../auth0/auth0.client';

const extractAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class IdentifyService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async identifyUser(request: Request): Promise<User> {
    const accessToken = extractAccessToken(request);
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const authInfo: AuthInfo = await client.getProfile(accessToken);

    try {
      const existingUser = await this.usersRepo.getUser(`user:${authInfo.sub}`);
      return existingUser;
    } catch (e) {
      if (e instanceof NotFoundException) {
        const newUser = await this.usersRepo.saveUser(
          userParamsFromAuth(authInfo),
        );
        return newUser;
      }
      throw e;
    }
  }
}
