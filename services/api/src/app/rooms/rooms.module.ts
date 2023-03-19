import { AuthModule } from '@app/auth/auth.module';
import { Module } from '@nestjs/common';
import { CreateRoomUseCase } from '@usecases/rooms/create';
import { GetRoomUseCase } from '@usecases/rooms/get';
import { JoinRoomUseCase } from '@usecases/rooms/join';
import { RoomsController } from './rooms.controller';

@Module({
  imports: [AuthModule],
  controllers: [RoomsController],
  providers: [CreateRoomUseCase, GetRoomUseCase, JoinRoomUseCase],
  exports: [CreateRoomUseCase, GetRoomUseCase, JoinRoomUseCase],
})
export class RoomsModule {}
