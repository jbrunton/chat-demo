import { Command } from '@entities/command.entity';
import { User } from '@entities/users';
import { Injectable } from '@nestjs/common';
import { HelpCommandUseCase } from '@usecases/commands/help';
import { RenameRoomUseCase } from '@usecases/rooms/rename';
import { RenameUserUseCase } from '@usecases/users/rename';
import { Dispatcher } from '@entities/messages';
import { LoremCommandUseCase } from '@usecases/commands/lorem';
import { ParseCommandUseCase } from '@usecases/commands/parse';
import { ChangeRoomJoinPolicyUseCase } from '@usecases/rooms/change-room-join-policy';

@Injectable()
export class CommandService {
  constructor(
    private readonly renameUser: RenameUserUseCase,
    private readonly renameRoom: RenameRoomUseCase,
    private readonly lorem: LoremCommandUseCase,
    private readonly help: HelpCommandUseCase,
    private readonly parse: ParseCommandUseCase,
    private readonly changeRoomJoinPolicy: ChangeRoomJoinPolicyUseCase,
    readonly dispatcher: Dispatcher,
  ) {}

  async exec(command: Command, authenticatedUser: User): Promise<void> {
    const { roomId } = command;
    const { tag, params } = await this.parse.exec(command);
    switch (tag) {
      case 'help':
        await this.help.exec({ roomId, authenticatedUser });
        break;
      case 'renameRoom':
        await this.renameRoom.exec({ ...params, roomId, authenticatedUser });
        break;
      case 'renameUser':
        await this.renameUser.exec({ ...params, roomId, authenticatedUser });
        break;
      case 'lorem':
        await this.lorem.exec({ ...params, roomId, authenticatedUser });
        break;
      case 'changeRoomJoinPolicy':
        await this.changeRoomJoinPolicy.exec({
          ...params,
          roomId,
          authenticatedUser,
        });
    }
  }
}
