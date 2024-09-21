import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { config } from './auth0.config';
import { Request } from 'express';
import { User } from '@entities/users/user';
import { IdentifyService } from './identify.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly identifyService: IdentifyService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.issuerUrl}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.audience,
      issuer: config.issuerUrl,
      algorithms: ['RS256'],

      passReqToCallback: true,
    });
  }

  async validate(request: Request): Promise<User | null> {
    return this.identifyService.identifyUser(request);
  }
}
