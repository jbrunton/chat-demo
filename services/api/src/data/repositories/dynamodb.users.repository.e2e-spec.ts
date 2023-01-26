import { DynamoDBUsersRepository } from '@data/repositories/dynamodb.users.repository';
import { SaveUserParams } from '@entities/users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';

describe('DynamoDBUsersRepository', () => {
  let usersRepo: DynamoDBUsersRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule],
      providers: [DynamoDBUsersRepository],
    }).compile();

    usersRepo = moduleFixture.get(DynamoDBUsersRepository);
  });

  it('stores and finds users', async () => {
    const params: SaveUserParams = {
      sub: 'google_123',
      name: 'Some User',
    };

    const user = await usersRepo.saveUser(params);
    const found = await usersRepo.getUser('user:google_123');

    expect(user).toMatchObject({
      id: 'user:google_123',
      name: 'Some User',
    });
    expect(found).toMatchObject({
      id: 'user:google_123',
      name: 'Some User',
    });
  });

  it('updates users', async () => {
    const params: SaveUserParams = {
      name: 'Some User',
      sub: 'user:google_123',
    };
    const user = await usersRepo.saveUser(params);

    const updated = await usersRepo.updateUser({
      id: user.id,
      name: 'Renamed User',
    });
    const found = await usersRepo.getUser(user.id);

    const expected = {
      id: user.id,
      name: 'Renamed User',
    };
    expect(updated).toMatchObject(expected);
    expect(found).toMatchObject(expected);
  });
});
