import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';
import {
  CreateRoomParams,
  SaveMessageParams,
  SaveUserParams,
} from '../db.adapter';
import { DynamoDBAdapter } from './dynamodb.adapter';

const timeout = 60;
jest.setTimeout(timeout * 1000);

describe('DynamoDBAdapter', () => {
  let db: DynamoDBAdapter;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule],
      providers: [DynamoDBAdapter],
    }).compile();

    db = moduleFixture.get(DynamoDBAdapter);
    await db.create();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('stores and finds users', async () => {
    const params: SaveUserParams = {
      sub: 'google_123',
      name: 'Some User',
    };

    const user = await db.saveUser(params);
    const found = await db.getUser('user:google_123');

    expect(user).toMatchObject({
      id: 'user:google_123',
      name: 'Some User',
    });
    expect(found).toMatchObject({
      id: 'user:google_123',
      name: 'Some User',
    });
  });

  it('stores and finds rooms', async () => {
    const params: CreateRoomParams = {
      name: 'Some Room',
      ownerId: 'user:google_123',
    };

    const room = await db.createRoom(params);
    const found = await db.getRoom(room.id);

    expect(room).toMatchObject(params);
    expect(found).toMatchObject(params);
  });

  it('stores and finds messages', async () => {
    const params: SaveMessageParams = {
      content: 'Hello, World!',
      authorId: 'user:google_123',
      time: 1001,
      roomId: 'room:123',
    };

    const msg1 = await db.saveMessage(params);
    const found = await db.getMessagesForRoom('room:123');

    expect(msg1).toMatchObject(params);
    expect(found).toMatchObject([params]);
  });
});
