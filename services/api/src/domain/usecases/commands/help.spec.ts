import { HelpCommandUseCase } from './help';
import { MockProxy, mock } from 'jest-mock-extended';
import { Dispatcher } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { UserFactory } from '@fixtures/messages/user.factory';
import { RoomFactory } from '@fixtures/messages/room.factory';

describe('HelpCommandUseCase', () => {
  let help: HelpCommandUseCase;

  let dispatcher: MockProxy<Dispatcher>;
  let authenticatedUser: User;
  let roomId: string;

  beforeEach(() => {
    dispatcher = mock<Dispatcher>();
    authenticatedUser = UserFactory.build();
    roomId = RoomFactory.id();

    help = new HelpCommandUseCase(dispatcher);
  });

  it('Sends a help response', async () => {
    await help.exec({ authenticatedUser, roomId });
    expect(dispatcher.send).toHaveBeenCalledWith({
      authorId: 'system',
      roomId,
      recipientId: authenticatedUser.id,
      content: [
        'Type to chat, or enter one of the following commands:',
        '* `/help`: list commands',
        "* `/lorem {count} {'words' | 'paragraphs'}`: generate lorem text",
        '* `/rename room {name}`: change the room name',
        '* `/rename user {name}`: change your display name',
      ].join('\n'),
    });
  });
});
