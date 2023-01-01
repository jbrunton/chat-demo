import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';
import { DynamoDBAdapter } from './dynamodb.adapter';

const timeout = 60;

jest.setTimeout(timeout * 1000);

describe('DbAdapter', () => {
  let db: DynamoDBAdapter;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule],
    }).compile();
    db = moduleFixture.get(DynamoDBAdapter);
    await db.create();
    await db.waitForTable(timeout);
  });

  afterAll(async () => {
    await db.waitForTable(timeout);
    await db.destroy();
  });

  it('queries items', async () => {
    const items = [
      { Id: 'User#1', Sort: 'User' },
      { Id: 'User#1', Sort: 'Room#1' },
      { Id: 'User#2', Sort: 'User' },
    ];
    for (const item of items) {
      await db.putItem({
        Item: item,
      });
    }

    const result = await db.query({
      KeyConditionExpression: 'Id = :id and begins_with(Sort,:filter)',
      ExpressionAttributeValues: {
        ':id': 'User#1',
        ':filter': 'Room#',
      },
    });

    expect(result.Items?.length).toEqual(1);
  });

  it('batch gets items', async () => {
    const items = [
      { Id: 'User#1', Sort: 'User' },
      { Id: 'User#1', Sort: 'Room#1' },
      { Id: 'User#2', Sort: 'User' },
    ];
    for (const item of items) {
      await db.putItem({
        Item: item,
      });
    }

    const result = await db.batchGet([
      { Id: 'User#1', Sort: 'User' },
      { Id: 'User#2', Sort: 'User' },
    ]);

    expect(result).toEqual([
      { Sort: 'User', Id: 'User#1' },
      { Sort: 'User', Id: 'User#2' },
    ]);
  });
});
