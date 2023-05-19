import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DispatcherService } from './dispatcher.service';
import { AuthModule } from '@app/auth/auth.module';
import { Dispatcher } from '@entities/message.entity';
import { SendMessageUseCase } from '@usecases/messages/send';
import { GetMessagesUseCase } from '@usecases/messages/get-messages';
import { ParseCommandUseCase } from '@usecases/commands/parse';
import { CommandService } from '@app/messages/command.service';
import { RenameRoomUseCase } from '@usecases/rooms/rename';
import { RenameUserUseCase } from '@usecases/users/rename';
import { HelpCommandUseCase } from '@usecases/commands/help';
import { LoremCommandUseCase, LoremGenerator } from '@usecases/commands/lorem';
import { FakerLoremGenerator } from './faker.lorem.generator';

@Module({
  imports: [AuthModule],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    {
      provide: Dispatcher,
      useClass: DispatcherService,
    },
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
    LoremCommandUseCase,
    HelpCommandUseCase,
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
