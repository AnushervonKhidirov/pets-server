import type { Request } from 'express';
import type { TokenDecoded } from 'src/token/token.type';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest<Request>();
    const userPayload: TokenDecoded | undefined = request['user'];

    if (!userPayload?.role) throw new UnauthorizedException();
    if (!roles.includes(userPayload.role)) throw new ForbiddenException();
    return true;
  }
}
