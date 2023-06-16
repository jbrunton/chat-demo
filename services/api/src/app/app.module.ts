import { ConsoleLogger, Global, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from '@app/auth/auth.module';
import { MessagesModule } from '@app/messages/messages.module';
import { RoomsModule } from '@app/rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { AppLogger } from './app.logger';

@Global()
@Module({
  providers: [
    {
      provide: ConsoleLogger,
      useClass: AppLogger,
    },
  ],
  exports: [ConsoleLogger],
})
export class LoggerModule {}

@Module({
  imports: [LoggerModule, AuthModule, MessagesModule, RoomsModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
