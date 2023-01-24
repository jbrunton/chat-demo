import { DynamoDBRoomsRepository } from '@data/repositories/dynamodb.rooms.repository';
import { CreateRoomParams } from '@entities/rooms.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';

describe('DynamoDBRoomsRepository', () => {
  let roomsRepo: DynamoDBRoomsRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule],
      providers: [DynamoDBRoomsRepository],
    }).compile();

    roomsRepo = moduleFixture.get(DynamoDBRoomsRepository);
  });

  it('stores and finds rooms', async () => {
    const params: CreateRoomParams = {
      name: 'Some Room',
      ownerId: 'user:google_123',
    };

    const room = await roomsRepo.createRoom(params);
    const found = await roomsRepo.getRoom(room.id);

    expect(room).toMatchObject(params);
    expect(found).toMatchObject(params);
  });

  it('updates rooms', async () => {
    const params: CreateRoomParams = {
      name: 'Some Room',
      ownerId: 'user:google_123',
    };
    const room = await roomsRepo.createRoom(params);

    const updated = await roomsRepo.updateRoom({
      id: room.id,
      name: 'Renamed Room',
    });
    const found = await roomsRepo.getRoom(room.id);

    const expected = {
      id: room.id,
      name: 'Renamed Room',
      ownerId: params.ownerId,
    };
    expect(updated).toMatchObject(expected);
    expect(found).toMatchObject(expected);
  });
});
