import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from '@lib/auth/auth.module';
import { MessagesModule } from '@features/messages/messages.module';

@Module({
  imports: [AuthModule, MessagesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
