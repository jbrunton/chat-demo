import { AuthInfo } from '@entities/auth';
import { ConsoleLogger, Injectable, Logger } from '@nestjs/common';
import { AuthenticationClient } from 'auth0';
import { config } from './auth0.config';
import { createCache, Cache } from 'async-cache-dedupe';

type CachedFunctions = {
  getProfile: (accessToken: string) => Promise<AuthInfo>;
};

@Injectable()
export class Auth0Client {
  private readonly client = new AuthenticationClient({
    domain: config.domain,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  });

  private readonly profileCache = createCache({
    ttl: 60, // seconds
    storage: { type: 'memory' },
  }) as Cache & CachedFunctions;

  constructor(private readonly logger: ConsoleLogger) {
    logger.setContext('Auth0Client');
    this.profileCache.define('getProfile', this.fetchProfile);
  }

  public getProfile(accessToken: string): Promise<AuthInfo> {
    return this.profileCache.getProfile(accessToken);
  }

  private fetchProfile(accessToken: string): Promise<AuthInfo> {
    this.logger.log(`fetching profile for ${accessToken.substring(0, 20)}`);
    return this.client.getProfile(accessToken);
  }
}
