import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DispatcherService } from './dispatcher.service';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [MessagesController],
  providers: [MessagesService, DispatcherService],
  exports: [MessagesService],
})
export class MessagesModule {}
