import { DynamoDBMessagesRepository } from '@data/repositories/dynamodb.messages.repository';
import { SaveMessageParams } from '@entities/messages.repository';
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
    const params: SaveMessageParams = {
      content: 'Hello, World!',
      authorId: 'user:google_123',
      time: 1001,
      roomId: 'room:123',
    };

    const msg1 = await messagesRepo.saveMessage(params);
    const found = await messagesRepo.getMessagesForRoom('room:123');

    expect(msg1).toMatchObject(params);
    expect(found).toMatchObject([params]);
  });
});
