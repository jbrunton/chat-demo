import { AuthenticationClient } from 'auth0';
import { config } from './auth0.config';

export const client = new AuthenticationClient({
  domain: config.domain,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});
