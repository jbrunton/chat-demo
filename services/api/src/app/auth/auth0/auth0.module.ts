import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { IdentifyModule } from '../identity/identify.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    IdentifyModule,
  ],
  providers: [JwtStrategy],
})
export class Auth0Module {}
