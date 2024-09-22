import { Dispatcher } from '@entities/messages/message';
import { User } from '@entities/users/user';
import { Injectable } from '@nestjs/common';
import { commands } from './parse/commands/parsed-command';

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
    const commandSummaries = commands.map(
      (command) => `* \`${command.signature}\`: ${command.summary}`,
    );
    return [title, ...commandSummaries].join('\n');
  }
}
