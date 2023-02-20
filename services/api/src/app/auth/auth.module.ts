import { Module } from '@nestjs/common';
import { AuthService } from '@entities/auth';
import { CaslAuthService } from './casl.auth.service';
import { Auth0Module } from './auth0/auth0.module';

@Module({
  imports: [Auth0Module],
  providers: [
    {
      provide: AuthService,
      useClass: CaslAuthService,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
