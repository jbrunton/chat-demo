import { AuthModule } from '@app/auth/auth.module';
import { Module } from '@nestjs/common';
import { CreateRoomUseCase } from '@usecases/rooms/create';
import { GetRoomUseCase } from '@usecases/rooms/get';
import { JoinRoomUseCase } from '@usecases/rooms/join';
import { RoomsController } from './rooms.controller';
import { MessagesModule } from '@app/messages/messages.module';
import { DispatcherModule } from '@app/dispatcher/dispatcher.module';
import { InviteUseCase } from '@usecases/rooms/invite';

@Module({
  imports: [AuthModule, DispatcherModule, MessagesModule],
  controllers: [RoomsController],
  providers: [
    CreateRoomUseCase,
    GetRoomUseCase,
    JoinRoomUseCase,
    InviteUseCase,
  ],
  exports: [],
})
export class RoomsModule {}
