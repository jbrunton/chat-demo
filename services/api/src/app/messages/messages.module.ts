import { Module } from '@nestjs/common';
import { MessagesService } from './messages-service';
import { MessagesController } from './messages.controller';
import { AuthModule } from '@app/auth/auth.module';
import { SendMessageUseCase } from '@usecases/messages/send';
import { GetMessagesUseCase } from '@usecases/messages/get-messages';
import { ParseCommandUseCase } from '@usecases/commands/parse/parse-command';
import { CommandService } from '@app/messages/command-service';
import { RenameRoomUseCase } from '@usecases/rooms/rename';
import { RenameUserUseCase } from '@usecases/users/rename';
import { HelpCommandUseCase } from '@usecases/commands/help';
import { LoremCommandUseCase, LoremGenerator } from '@usecases/commands/lorem';
import { FakerLoremGenerator } from './faker.lorem.generator';
import { DispatcherModule } from '../dispatcher/dispatcher.module';
import { ConfigureRoomUseCase } from '@usecases/rooms/configure-room';
import { InviteUseCase } from '@usecases/memberships/invite';
import { LeaveRoomUseCase } from '@usecases/memberships/leave';
import { AboutRoomUseCase } from '@usecases/rooms/about-room';
import { ApproveRequestUseCase } from '@usecases/memberships/approve-request';

@Module({
  imports: [AuthModule, DispatcherModule],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    {
      provide: LoremGenerator,
      useClass: FakerLoremGenerator,
    },
    ParseCommandUseCase,
    SendMessageUseCase,
    GetMessagesUseCase,
    CommandService,
    RenameRoomUseCase,
    RenameUserUseCase,
    ConfigureRoomUseCase,
    InviteUseCase,
    LeaveRoomUseCase,
    LoremCommandUseCase,
    AboutRoomUseCase,
    ApproveRequestUseCase,
    HelpCommandUseCase,
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
