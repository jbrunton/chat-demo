import { DbAdapter } from './db.adapter';

jest.setTimeout(20_000);

describe('DbAdapter', () => {
  let db: DbAdapter;

  beforeAll(async () => {
    db = new DbAdapter();
    await db.create();
    await db.waitForTable();
  });

  afterAll(async () => {
    await db.waitForTable();
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
});
