import { DynamoDBMessagesRepository } from '@data/repositories/dynamodb.messages.repository';
import { SaveMessageParams } from '@entities/messages.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';

describe('DynamoDBMessagesRepository', () => {
  let messagesRepo: DynamoDBMessagesRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule],
      providers: [DynamoDBMessagesRepository],
    }).compile();

    messagesRepo = moduleFixture.get(DynamoDBMessagesRepository);
  });

  it('stores and finds messages', async () => {
    const { id: authorId } = UserFactory.build();
    const { id: roomId } = RoomFactory.build();
    const params: SaveMessageParams = {
      content: 'Hello, World!',
      authorId,
      time: 1001,
      roomId,
    };

    const msg = await messagesRepo.saveMessage(params);
    const found = await messagesRepo.getMessagesForRoom(roomId);

    expect(msg).toMatchObject(params);
    expect(found).toMatchObject([params]);
  });

  it('retrieves messages for an author', async () => {
    const author1 = UserFactory.build();
    const author2 = UserFactory.build();
    const msg1 = await messagesRepo.saveMessage({
      content: 'Hello, World!',
      authorId: author1.id,
      time: 1001,
      roomId: 'room:123',
    });
    const msg2 = await messagesRepo.saveMessage({
      content: 'Goodbye, World!',
      authorId: author1.id,
      time: 1002,
      roomId: 'room:456',
    });
    await messagesRepo.saveMessage({
      content: 'Hello, World!',
      authorId: author2.id,
      time: 1002,
      roomId: 'room:456',
    });

    const messages = await messagesRepo.getAuthorHistory(author1.id);

    expect(messages.length).toEqual(2);
    expect(messages).toMatchObject([msg2, msg1]);
  });
});
