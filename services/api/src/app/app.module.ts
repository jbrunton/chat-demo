import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from '@app/auth/auth.module';
import { MessagesModule } from '@app/messages/messages.module';
import { RoomsModule } from '@app/rooms/rooms.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, MessagesModule, RoomsModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
