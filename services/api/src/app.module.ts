import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [AuthModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
