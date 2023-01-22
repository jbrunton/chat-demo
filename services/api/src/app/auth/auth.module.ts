import { Module } from '@nestjs/common';
import { Auth0Module } from './auth0/auth0.module';

@Module({
  imports: [Auth0Module],
})
export class AuthModule {}
