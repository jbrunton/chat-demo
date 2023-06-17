import { faker } from '@faker-js/faker';
import { User } from './user.entity';
import { AuthInfo } from '@entities/auth';

export type SaveUserParams = AuthInfo & {
  name: string;
};

export type UpdateUserParams = Partial<Pick<User, 'name'>> & Pick<User, 'id'>;

export abstract class UsersRepository {
  abstract saveUser(params: SaveUserParams): Promise<User>;
  abstract getUser(id: string): Promise<User>;
  abstract updateUser(params: UpdateUserParams): Promise<User>;
}

export const userParamsFromAuth = (authInfo: AuthInfo): SaveUserParams => ({
  sub: authInfo.sub,
  name: authInfo.name ?? `${faker.word.adverb()}-${faker.animal.bird()}`,
  picture: authInfo.picture,
});
