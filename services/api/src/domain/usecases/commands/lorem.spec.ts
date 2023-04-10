import { TestMessagesRepository } from '@fixtures/data/test.messages.repository';
import { LoremCommandUseCase, LoremGenerator, LoremParams } from './lorem';
import { MockProxy, mock } from 'jest-mock-extended';
import { Dispatcher } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';

describe('LoremCommandUseCase', () => {
  let lorem: LoremCommandUseCase;

  //let messages: TestMessagesRepository;
  let dispatcher: MockProxy<Dispatcher>;
  let authenticatedUser: User;
  let roomId: string;

  let loremGenerator: LoremGenerator;

  beforeEach(() => {
    const messages = new TestMessagesRepository();
    dispatcher = mock<Dispatcher>();
    authenticatedUser = UserFactory.build();
    roomId = RoomFactory.id();
    loremGenerator = new (class extends LoremGenerator {
      generate(params: LoremParams): string {
        return `lorem ${params.count} ${params.typeToken}`;
      }
    })();

    lorem = new LoremCommandUseCase(messages, dispatcher, loremGenerator);
  });

  it('validates the count argument', async () => {
    await lorem.exec({
      count: 21,
      typeToken: 'paragraphs',
      roomId,
      authenticatedUser,
    });

    expect(dispatcher.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        authorId: 'system',
        roomId,
        recipientId: authenticatedUser.id,
        content: '`count` must be between 1 and 20',
      }),
    );
  });

  it('generates lorem content', async () => {
    await lorem.exec({
      count: 3,
      typeToken: 'words',
      roomId,
      authenticatedUser,
    });

    expect(dispatcher.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        authorId: 'system',
        roomId,
        content: 'lorem 3 words',
      }),
    );
  });
});
