import { faker } from '@faker-js/faker';
import { User } from './user.entity';
import { AuthInfo } from '@entities/auth';

export type SaveUserParams = AuthInfo & {
  name: string;
  email: string;
};

export type UpdateUserParams = Partial<Pick<User, 'name'>> & Pick<User, 'id'>;

export abstract class UsersRepository {
  abstract saveUser(params: SaveUserParams): Promise<User>;
  abstract getUser(id: string): Promise<User>;
  abstract findUser(email: string): Promise<User | null>;
  abstract updateUser(params: UpdateUserParams): Promise<User>;
}

export const userParamsFromAuth = (authInfo: AuthInfo): SaveUserParams => {
  if (!authInfo.email) {
    throw new Error('Missing email');
  }

  return {
    sub: authInfo.sub,
    email: authInfo.email,
    name: authInfo.name ?? `${faker.word.adverb()}-${faker.animal.bird()}`,
    picture: authInfo.picture,
  };
};
