import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Auth0Module } from './auth0/auth0.module';

@Module({
  imports: [Auth0Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
