import { Module } from '@nestjs/common';
import { DataModule } from '@data/data.module';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsRepository } from './repositories/rooms.repository';
import { UsersRepository } from '@features/messages/repositories/users.repository';

@Module({
  imports: [DataModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository, UsersRepository],
  exports: [RoomsService],
})
export class RoomsModule {}
