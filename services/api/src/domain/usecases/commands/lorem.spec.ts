import { LoremCommandUseCase, LoremGenerator, LoremParams } from './lorem';
import { MockProxy, mock } from 'jest-mock-extended';
import { Dispatcher } from '@entities/messages/message';
import { User } from '@entities/users/user';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';

describe('LoremCommandUseCase', () => {
  let lorem: LoremCommandUseCase;

  let dispatcher: MockProxy<Dispatcher>;
  let authenticatedUser: User;
  let roomId: string;

  class TestLoremGenerator extends LoremGenerator {
    generate(params: LoremParams): string {
      return `lorem ${params.count} ${params.typeToken}`;
    }
  }

  beforeEach(() => {
    dispatcher = mock<Dispatcher>();
    authenticatedUser = UserFactory.build();
    roomId = RoomFactory.id();

    lorem = new LoremCommandUseCase(dispatcher, new TestLoremGenerator());
  });

  it('validates the count argument', async () => {
    await lorem.exec({
      count: 21,
      typeToken: 'paragraphs',
      roomId,
      authenticatedUser,
    });

    expect(dispatcher.send).toHaveBeenCalledWith({
      authorId: 'system',
      roomId,
      recipientId: authenticatedUser.id,
      content: '`count` must be between 1 and 20',
    });
  });

  it('generates lorem content', async () => {
    await lorem.exec({
      count: 3,
      typeToken: 'words',
      roomId,
      authenticatedUser,
    });

    expect(dispatcher.send).toHaveBeenCalledWith({
      authorId: 'system',
      roomId,
      content: 'lorem 3 words',
    });
  });
});
