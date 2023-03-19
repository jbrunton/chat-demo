import { AuthInfo } from '@entities/auth';
import { Logger } from '@nestjs/common';
import { AuthenticationClient } from 'auth0';
import { config } from './auth0.config';
import { createCache, Cache } from 'async-cache-dedupe';

const client = new AuthenticationClient({
  domain: config.domain,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});

const logger = new Logger('auth0.clientCache');

const getProfile = (accessToken: string): Promise<AuthInfo> => {
  logger.log(`fetching profile for ${accessToken.substring(0, 20)}`);
  return client.getProfile(accessToken);
};

type CachedFunctions = {
  getProfile: typeof getProfile;
};

export const clientCache = createCache({
  ttl: 60, // seconds
  storage: { type: 'memory' },
}) as Cache & CachedFunctions;

clientCache.define('getProfile', getProfile);
