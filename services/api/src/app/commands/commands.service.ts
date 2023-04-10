import { ParsedCommand } from '@entities/command.entity';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { HelpCommandUseCase } from '@usecases/commands/commands/help';
import { LoremCommandUseCase } from '@usecases/commands/commands/lorem.command';
import { RenameRoomUseCase } from '@usecases/rooms/rename';
import { RenameUserUseCase } from '@usecases/users/rename';

@Injectable()
export class CommandService {
  constructor(
    private readonly renameUser: RenameUserUseCase,
    private readonly renameRoom: RenameRoomUseCase,
    private readonly lorem: LoremCommandUseCase,
    private readonly help: HelpCommandUseCase,
  ) {}

  async exec(
    { tag, params }: ParsedCommand,
    roomId: string,
    authenticatedUser: User,
  ): Promise<void> {
    switch (tag) {
      case 'help':
        return this.help.exec({ roomId, authenticatedUser });
      case 'renameRoom':
        return this.renameRoom.exec({ ...params, roomId, authenticatedUser });
      case 'renameUser':
        return this.renameUser.exec({ ...params, roomId, authenticatedUser });
      case 'lorem':
        return this.lorem.exec({ ...params, roomId, authenticatedUser });
    }
  }
}
