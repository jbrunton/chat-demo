import { Dispatcher } from '@entities/message.entity';
import { MessagesRepository } from '@entities/messages.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { parsers } from './parse/parsers';

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
      content: this.generateContent(),
      recipientId: authenticatedUser.id,
      roomId,
      authorId: 'system',
    });
    this.dispatcher.emit(message);
  }

  private generateContent() {
    const title = 'Type to chat, or enter one of the following commands:';
    const commands = parsers.map(
      (parser) => `* \`${parser.signature}\`: ${parser.summary}`,
    );
    return [title, ...commands].join('\n');
  }
}
