import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenJwtGuard extends AuthGuard('jwt-refresh') {}
