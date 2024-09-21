import { User } from '@entities/users/user';
import { Injectable } from '@nestjs/common';
import { HelpCommandUseCase } from '@usecases/commands/help';
import { RenameRoomUseCase } from '@usecases/rooms/rename';
import { RenameUserUseCase } from '@usecases/users/rename';
import { Dispatcher } from '@entities/messages/message';
import { LoremCommandUseCase } from '@usecases/commands/lorem';
import { ParseCommandUseCase } from '@usecases/commands/parse';
import { ConfigureRoomUseCase } from '@usecases/rooms/configure-room';
import { P, match } from 'ts-pattern';
import { InviteUseCase } from '@usecases/memberships/invite';
import { LeaveRoomUseCase } from '@usecases/memberships/leave';
import { AboutRoomUseCase } from '@usecases/rooms/about-room';
import { ApproveRequestUseCase } from '@usecases/memberships/approve-request';
import { TokenizedCommand } from '@usecases/commands/tokenize';

@Injectable()
export class CommandService {
  constructor(
    private readonly renameUser: RenameUserUseCase,
    private readonly renameRoom: RenameRoomUseCase,
    private readonly lorem: LoremCommandUseCase,
    private readonly help: HelpCommandUseCase,
    private readonly leave: LeaveRoomUseCase,
    private readonly parse: ParseCommandUseCase,
    private readonly approveRequest: ApproveRequestUseCase,
    private readonly changeRoomJoinPolicy: ConfigureRoomUseCase,
    private readonly aboutRoom: AboutRoomUseCase,
    private readonly invite: InviteUseCase,
    readonly dispatcher: Dispatcher,
  ) {}

  async exec(
    command: TokenizedCommand,
    authenticatedUser: User,
  ): Promise<void> {
    const { roomId } = command;
    const parsedCommand = this.parse.exec(command);
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
      .with({ tag: 'setRoomJoinPolicy', params: P.select() }, (params) =>
        this.changeRoomJoinPolicy.exec({
          ...params,
          roomId,
          authenticatedUser,
        }),
      )
      .with({ tag: 'setRoomContentPolicy', params: P.select() }, (params) =>
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
      .with({ tag: 'approveRequest', params: P.select() }, (params) =>
        this.approveRequest.exec({
          ...params,
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
