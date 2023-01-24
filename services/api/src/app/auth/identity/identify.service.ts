import { AuthInfo } from '@entities/auth-info';
import { User } from '@entities/user.entity';
import {
  userParamsFromAuth,
  UsersRepository,
} from '@entities/users.repository';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { client } from '../auth0/auth0.client';

const extractAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class IdentifyService {
  private readonly logger = new Logger(IdentifyService.name);

  constructor(
    private readonly usersRepo: UsersRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async identifyUser(request: Request): Promise<User> {
    const accessToken = extractAccessToken(request);
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      let authInfo: AuthInfo | undefined = await this.cache.get(
        `profile:${accessToken}`,
      );
      if (!authInfo) {
        authInfo = (await client.getProfile(accessToken)) as AuthInfo;
        this.cache.set(`profile:${accessToken}`, authInfo);
      }

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
