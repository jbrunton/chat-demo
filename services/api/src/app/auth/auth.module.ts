import { Module } from '@nestjs/common';
import { CaslAuthService } from './auth.service';
import { Auth0Module } from './auth0/auth0.module';

@Module({
  imports: [Auth0Module],
  providers: [CaslAuthService],
  exports: [CaslAuthService],
})
export class AuthModule {}
