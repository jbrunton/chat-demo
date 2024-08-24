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
import { P, match } from 'ts-pattern';
import { InviteUseCase } from '@usecases/rooms/invite';
import { LeaveRoomUseCase } from '@usecases/rooms/leave';
import { AboutRoomUseCase } from '@usecases/rooms/about-room';

@Injectable()
export class CommandService {
  constructor(
    private readonly renameUser: RenameUserUseCase,
    private readonly renameRoom: RenameRoomUseCase,
    private readonly lorem: LoremCommandUseCase,
    private readonly help: HelpCommandUseCase,
    private readonly leave: LeaveRoomUseCase,
    private readonly parse: ParseCommandUseCase,
    private readonly changeRoomJoinPolicy: ChangeRoomJoinPolicyUseCase,
    private readonly aboutRoom: AboutRoomUseCase,
    private readonly invite: InviteUseCase,
    readonly dispatcher: Dispatcher,
  ) {}

  async exec(command: Command, authenticatedUser: User): Promise<void> {
    const { roomId } = command;
    const parsedCommand = await this.parse.exec(command);
    return match(parsedCommand)
      .with({ tag: 'help' }, () =>
        this.help.exec({ roomId, authenticatedUser }),
      )
      .with({ tag: 'renameRoom', params: P.select() }, (params) =>
        this.renameRoom.exec({ ...params, roomId, authenticatedUser }),
      )
      .with({ tag: 'renameUser', params: P.select() }, (params) =>
        this.renameUser.exec({ ...params, roomId, authenticatedUser }),
      )
      .with({ tag: 'lorem', params: P.select() }, (params) =>
        this.lorem.exec({ ...params, roomId, authenticatedUser }),
      )
      .with({ tag: 'changeRoomJoinPolicy', params: P.select() }, (params) =>
        this.changeRoomJoinPolicy.exec({
          ...params,
          roomId,
          authenticatedUser,
        }),
      )
      .with({ tag: 'leave' }, () =>
        this.leave.exec({
          roomId,
          authenticatedUser,
        }),
      )
      .with({ tag: 'aboutRoom' }, () =>
        this.aboutRoom.exec({
          roomId,
          authenticatedUser,
        }),
      )
      .with({ tag: 'inviteUser', params: P.select() }, (params) => {
        this.invite.exec({ ...params, roomId, authenticatedUser });
      })
      .exhaustive();
  }
}
