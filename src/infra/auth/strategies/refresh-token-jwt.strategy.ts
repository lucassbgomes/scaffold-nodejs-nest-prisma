import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EnvService } from '@/infra/env/env.service';
import { Request } from 'express';
import { UserPayload, tokenPayloadSchema } from './jwt.strategy';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: EnvService) {
    const publicKey = config.get('JWT_PUBLIC_KEY');

    const jwtFromRequest = ExtractJwt.fromExtractors([
      (request: Request) => {
        if (
          request.headers.cookie &&
          'refresh_token'.includes(request.headers.cookie)
        ) {
          return request.headers.cookie;
        }

        return null;
      },
      ExtractJwt.fromAuthHeaderAsBearerToken(),
    ]);

    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}
