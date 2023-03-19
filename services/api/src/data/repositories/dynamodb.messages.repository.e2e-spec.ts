import { DynamoDBMessagesRepository } from '@data/repositories/dynamodb.messages.repository';
import { DraftMessage } from '@entities/message.entity';
import { TestMessagesRepository } from '@fixtures/data/test.messages.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';

type TestCase = {
  name: 'DynamoDBMessagesRepository' | 'TestMessagesRepository';
};

describe('MessagesRepository', () => {
  let repos: {
    DynamoDBMessagesRepository: DynamoDBMessagesRepository;
    TestMessagesRepository: TestMessagesRepository;
  };

  const testCases: TestCase[] = [
    { name: 'DynamoDBMessagesRepository' },
    { name: 'TestMessagesRepository' },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule],
      providers: [DynamoDBMessagesRepository],
    }).compile();

    repos = {
      DynamoDBMessagesRepository: moduleFixture.get(DynamoDBMessagesRepository),
      TestMessagesRepository: new TestMessagesRepository(),
    };
  });

  test.each(testCases)(
    '[$name] stores and finds messages',
    async ({ name }) => {
      const repo = repos[name];
      const { id: authorId } = UserFactory.build();
      const { id: roomId } = RoomFactory.build();
      const params: DraftMessage = {
        content: 'Hello, World!',
        authorId,
        roomId,
      };

      const msg = await repo.saveMessage(params);
      const found = await repo.getMessagesForRoom(roomId);

      expect(msg).toMatchObject(params);
      expect(found).toMatchObject([params]);
    },
  );

  test.each(testCases)(
    '[$name] retrieves messages for an author',
    async ({ name }) => {
      const repo = repos[name];
      const author1 = UserFactory.build();
      const author2 = UserFactory.build();
      const msg1 = await repo.saveMessage({
        content: 'Hello, World!',
        authorId: author1.id,
        roomId: 'room:123',
      });
      const msg2 = await repo.saveMessage({
        content: 'Goodbye, World!',
        authorId: author1.id,
        roomId: 'room:456',
      });
      await repo.saveMessage({
        content: 'Hello, World!',
        authorId: author2.id,
        roomId: 'room:456',
      });

      const messages = await repo.getAuthorHistory(author1.id);

      expect(messages.length).toEqual(2);
      expect(messages).toMatchObject([msg2, msg1]);
    },
  );
});
