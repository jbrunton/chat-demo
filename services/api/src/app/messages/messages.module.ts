import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { AuthModule } from '@app/auth/auth.module';
import { SendMessageUseCase } from '@usecases/messages/send';
import { GetMessagesUseCase } from '@usecases/messages/get-messages';
import { ParseCommandUseCase } from '@usecases/commands/parse';
import { CommandService } from '@app/messages/command.service';
import { RenameRoomUseCase } from '@usecases/rooms/rename';
import { RenameUserUseCase } from '@usecases/users/rename';
import { HelpCommandUseCase } from '@usecases/commands/help';
import { LoremCommandUseCase, LoremGenerator } from '@usecases/commands/lorem';
import { FakerLoremGenerator } from './faker.lorem.generator';
import { DispatcherModule } from '../dispatcher/dispatcher.module';
import { ChangeRoomJoinPolicyUseCase } from '@usecases/rooms/change-room-join-policy';
import { InviteUseCase } from '@usecases/rooms/invite';

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
    ChangeRoomJoinPolicyUseCase,
    InviteUseCase,
    LoremCommandUseCase,
    HelpCommandUseCase,
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
