import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from '@lib/auth/auth.module';
import { MessagesModule } from '@features/messages/messages.module';
import { RoomsModule } from '@features/rooms/rooms.module';

@Module({
  imports: [AuthModule, MessagesModule, RoomsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
