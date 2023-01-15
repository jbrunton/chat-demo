import { AuthInfo } from '@lib/auth/identity/auth-info';
import { faker } from '@faker-js/faker';

export class User {
  id: string;
  name: string;
  picture?: string;
}

export const userFromAuthInfo = (authInfo: AuthInfo): User => ({
  id: `User#${authInfo.sub}`,
  name: authInfo.name ?? `${faker.word.adverb()}-${faker.animal.bird()}`,
  picture: authInfo.picture,
});
