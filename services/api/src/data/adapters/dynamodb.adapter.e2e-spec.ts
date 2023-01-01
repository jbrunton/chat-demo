import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';
import { DBItem } from '../db.adapter';
import { DynamoDBAdapter } from './dynamodb.adapter';

const timeout = 60;
jest.setTimeout(timeout * 1000);

type UserItem = DBItem<{ name: string }>;
type RoomParticipantItem = DBItem<unknown>;

describe('DynamoDBAdapter', () => {
  let db: DynamoDBAdapter;

  const user1: UserItem = {
    Id: 'User#1',
    Sort: 'User',
    Type: 'User',
    Data: { name: 'User 1' },
  };
  const user1Room: RoomParticipantItem = {
    Id: 'User#1',
    Sort: 'Room#1',
    Type: 'User',
    Data: {},
  };
  const user2: UserItem = {
    Id: 'User#2',
    Sort: 'User',
    Type: 'User',
    Data: { name: 'User 2' },
  };

  const items: DBItem<unknown>[] = [user1, user1Room, user2];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule],
      providers: [DynamoDBAdapter],
    }).compile();

    db = moduleFixture.get(DynamoDBAdapter);
    await db.create();
    await db.waitForTable(timeout);

    for (const item of items) {
      await db.putItem(item);
    }
  });

  afterAll(async () => {
    await db.waitForTable(timeout);
    await db.destroy();
  });

  it('queries items', async () => {
    const result = await db.query({
      KeyConditionExpression: 'Id = :id and begins_with(Sort,:filter)',
      ExpressionAttributeValues: {
        ':id': 'User#1',
        ':filter': 'Room#',
      },
    });

    expect(result).toEqual([user1Room]);
  });

  it('batch gets items', async () => {
    const result = await db.batchGet([
      { Id: 'User#1', Sort: 'User' },
      { Id: 'User#2', Sort: 'User' },
    ]);

    expect(result).toEqual([user1, user2]);
  });
});
