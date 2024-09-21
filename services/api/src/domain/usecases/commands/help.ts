import { Dispatcher } from '@entities/messages/message';
import { User } from '@entities/users/user.entity';
import { Injectable } from '@nestjs/common';
import { parsers } from './parse/parsers';

export type HelpParams = {
  authenticatedUser: User;
  roomId: string;
};

@Injectable()
export class HelpCommandUseCase {
  constructor(private readonly dispatcher: Dispatcher) {}

  async exec(params: HelpParams): Promise<void> {
    const { roomId, authenticatedUser } = params;
    await this.dispatcher.send({
      content: this.generateContent(),
      recipientId: authenticatedUser.id,
      roomId,
      authorId: 'system',
    });
  }

  private generateContent() {
    const title = 'Type to chat, or enter one of the following commands:';
    const commands = parsers.map(
      (parser) => `* \`${parser.signature}\`: ${parser.summary}`,
    );
    return [title, ...commands].join('\n');
  }
}
