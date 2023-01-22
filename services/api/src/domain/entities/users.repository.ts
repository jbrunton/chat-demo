import { faker } from '@faker-js/faker';
import { AuthInfo } from '@lib/auth/identity/auth-info';
import { User } from './user.entity';

export type SaveUserParams = AuthInfo & {
  name: string;
};

export abstract class UsersRepository {
  abstract saveUser(params: SaveUserParams): Promise<User>;
  abstract getUser(id: string): Promise<User>;
}

export const userParamsFromAuth = (authInfo: AuthInfo): SaveUserParams => ({
  sub: authInfo.sub,
  name: authInfo.name ?? `${faker.word.adverb()}-${faker.animal.bird()}`,
  picture: authInfo.picture,
});
