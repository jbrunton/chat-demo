import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
