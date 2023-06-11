import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { IdentifyService } from './identify.service';
import { Auth0Client } from './auth0.client';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [Auth0Client, JwtStrategy, IdentifyService],
})
export class Auth0Module {}
