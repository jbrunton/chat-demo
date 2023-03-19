import { Dispatcher } from '@entities/message.entity';
import { MessagesRepository } from '@entities/messages.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';

const helpContent = `
Type to chat, or enter one of the following commands:

\`/help\`: list commands
\`/rename user {name}\`: change your display name
\`/rename room {name}\`: change the room name
\`/lorem {count} {'words' | 'paragraphs'}\`: generate lorem text
`;

export type HelpParams = {
  authenticatedUser: User;
  roomId: string;
};

@Injectable()
export class HelpCommandUseCase {
  constructor(
    private readonly messages: MessagesRepository,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec(params: HelpParams): Promise<void> {
    const { roomId, authenticatedUser } = params;
    const message = await this.messages.saveMessage({
      content: helpContent,
      recipientId: authenticatedUser.id,
      roomId,
      authorId: 'system',
    });
    this.dispatcher.emit(message);
  }
}
