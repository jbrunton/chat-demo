import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DispatcherService } from './dispatcher.service';
import { AuthModule } from '@app/auth/auth.module';
import { RenameRoomUseCase } from '@usecases/rooms/rename';
import { RenameUserUseCase } from '@usecases/users/rename';
import { LoremCommandUseCase } from '@usecases/process-command/commands/lorem.command';
import { HelpCommandUseCase } from '@usecases/process-command/commands/help';
import { ProcessCommandUseCase } from '@usecases/process-command/process';
import { Dispatcher } from '@entities/message.entity';

@Module({
  imports: [AuthModule],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    {
      provide: Dispatcher,
      useClass: DispatcherService,
    },
    RenameRoomUseCase,
    RenameUserUseCase,
    LoremCommandUseCase,
    HelpCommandUseCase,
    ProcessCommandUseCase,
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
