import { Command } from '@entities/command.entity';
import { Dispatcher } from '@entities/message.entity';
import { MessagesRepository } from '@entities/messages.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { RenameRoomUseCase } from '@usecases/rooms/rename';
import { RenameUserUseCase } from '@usecases/users/rename';
import { HelpCommandUseCase } from './commands/help';
import { LoremCommandUseCase } from './commands/lorem.command';
import { ParsedCommand, parsers } from './parsers';

@Injectable()
export class ProcessCommandUseCase {
  constructor(
    private readonly messages: MessagesRepository,
    private readonly dispatcher: Dispatcher,
    private readonly help: HelpCommandUseCase,
    private readonly lorem: LoremCommandUseCase,
    private readonly renameUser: RenameUserUseCase,
    private readonly renameRoom: RenameRoomUseCase,
  ) {}

  async exec(command: Command, authenticatedUser: User): Promise<void> {
    for (const parser of parsers) {
      const parsedCommand = parser(command, authenticatedUser);
      if (parsedCommand) {
        return this.execCommand(parsedCommand);
      }
    }

    const message = await this.messages.saveMessage({
      roomId: command.roomId,
      content: unrecognisedResponse,
      authorId: 'system',
      recipientId: authenticatedUser.id,
    });
    this.dispatcher.emit(message);
  }

  private async execCommand({ tag, params }: ParsedCommand): Promise<void> {
    switch (tag) {
      case 'help':
        return this.help.exec(params);
      case 'renameRoom':
        return this.renameRoom.exec(params);
      case 'renameUser':
        return this.renameUser.exec(params);
      case 'lorem':
        return this.lorem.exec(params);
    }
  }
}

const unrecognisedResponse =
  'Unrecognised command, type <b>/help</b> for further assistance';
