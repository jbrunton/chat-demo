import { User } from '@entities/user.entity';
import {
  userParamsFromAuth,
  UsersRepository,
} from '@entities/users.repository';
import {
  ConsoleLogger,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { Auth0Client } from '../auth0/auth0.client';

const extractAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class IdentifyService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly auth0Client: Auth0Client,
    private readonly logger: ConsoleLogger,
  ) {
    logger.setContext(IdentifyService.name);
  }

  async identifyUser(request: Request): Promise<User> {
    const accessToken = extractAccessToken(request);
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const authInfo = await this.auth0Client.getProfile(accessToken);
      try {
        const existingUser = await this.usersRepo.getUser(
          `user:${authInfo.sub}`,
        );
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
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e.message, e.stack);
      }
      throw e;
    }
  }
}
