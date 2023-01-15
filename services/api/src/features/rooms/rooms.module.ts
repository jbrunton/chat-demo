import { Module } from '@nestjs/common';
import { DataModule } from '@data/data.module';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsRepository } from './repositories/rooms.repository';

@Module({
  imports: [DataModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository],
  exports: [RoomsService],
})
export class RoomsModule {}
