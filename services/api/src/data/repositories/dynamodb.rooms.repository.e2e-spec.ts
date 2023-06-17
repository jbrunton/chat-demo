import { DynamoDBRoomsRepository } from '@data/repositories/dynamodb.rooms.repository';
import { ContentPolicy, JoinPolicy } from '@entities/room.entity';
import { CreateRoomParams } from '@entities/rooms.repository';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { Test } from '@nestjs/testing';
import { DataModule } from '../data.module';
import { LoggerModule } from '@app/app.logger';

type TestCase = {
  name: 'DynamoDBRoomsRepository' | 'TestRoomsRepository';
};

describe('RoomsRepository', () => {
  let repos: {
    DynamoDBRoomsRepository: DynamoDBRoomsRepository;
    TestRoomsRepository: TestRoomsRepository;
  };

  const testCases: TestCase[] = [
    { name: 'DynamoDBRoomsRepository' },
    { name: 'TestRoomsRepository' },
  ];

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [DataModule, LoggerModule],
      providers: [DynamoDBRoomsRepository],
    }).compile();

    repos = {
      DynamoDBRoomsRepository: moduleFixture.get(DynamoDBRoomsRepository),
      TestRoomsRepository: new TestRoomsRepository(),
    };
  });

  test.each(testCases)('[$name] stores and finds rooms', async ({ name }) => {
    const repo = repos[name];
    const params: CreateRoomParams = {
      name: 'Some Room',
      ownerId: 'user:google_123',
      contentPolicy: ContentPolicy.Public,
      joinPolicy: JoinPolicy.Anyone,
    };

    const room = await repo.createRoom(params);
    const found = await repo.getRoom(room.id);

    expect(room).toMatchObject(params);
    expect(found).toMatchObject(params);
  });

  test.each(testCases)('[$name] updates rooms', async ({ name }) => {
    const repo = repos[name];
    const params: CreateRoomParams = {
      name: 'Some Room',
      ownerId: 'user:google_123',
      contentPolicy: ContentPolicy.Public,
      joinPolicy: JoinPolicy.Anyone,
    };
    const room = await repo.createRoom(params);

    const updated = await repo.updateRoom({
      id: room.id,
      name: 'Renamed Room',
    });
    const found = await repo.getRoom(room.id);

    const expected = {
      id: room.id,
      name: 'Renamed Room',
      ownerId: params.ownerId,
    };
    expect(updated).toMatchObject(expected);
    expect(found).toMatchObject(expected);
  });
});
