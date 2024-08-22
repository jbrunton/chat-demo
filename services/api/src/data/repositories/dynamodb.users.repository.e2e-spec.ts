import { DynamoDBUsersRepository } from '@data/repositories/dynamodb.users.repository';
import { SaveUserParams } from '@entities/users';
import { TestUsersRepository } from '@fixtures/data/test.users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';
import { MockLoggerModule } from '@fixtures/MockLoggerModule';

type TestCase = {
  name: 'DynamoDBUsersRepository' | 'TestUsersRepository';
};

describe('RoomsRepository', () => {
  let repos: {
    DynamoDBUsersRepository: DynamoDBUsersRepository;
    TestUsersRepository: TestUsersRepository;
  };

  const testCases: TestCase[] = [
    { name: 'DynamoDBUsersRepository' },
    { name: 'TestUsersRepository' },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule, MockLoggerModule],
      providers: [DynamoDBUsersRepository],
    }).compile();

    repos = {
      DynamoDBUsersRepository: moduleFixture.get(DynamoDBUsersRepository),
      TestUsersRepository: new TestUsersRepository(),
    };
  });

  test.each(testCases)('[$name] stores and finds users', async ({ name }) => {
    const repo = repos[name];

    const params: SaveUserParams = {
      sub: 'google_123',
      email: 'some.user@example.com',
      name: 'Some User',
    };

    const user = await repo.saveUser(params);
    const found = await repo.getUser('user:google_123');

    expect(user).toMatchObject({
      id: 'user:google_123',
      email: 'some.user@example.com',
      name: 'Some User',
    });
    expect(found).toMatchObject({
      id: 'user:google_123',
      email: 'some.user@example.com',
      name: 'Some User',
    });
  });

  test.each(testCases)('[$name] updates users', async ({ name }) => {
    const repo = repos[name];
    const params: SaveUserParams = {
      name: 'Other User',
      email: 'other.user@example.com',
      sub: 'user:google_123',
    };
    const user = await repo.saveUser(params);

    const updated = await repo.updateUser({
      id: user.id,
      name: 'Renamed User',
    });
    const found = await repo.getUser(user.id);

    const expected = {
      id: user.id,
      name: 'Renamed User',
    };
    expect(updated).toMatchObject(expected);
    expect(found).toMatchObject(expected);
  });
});
