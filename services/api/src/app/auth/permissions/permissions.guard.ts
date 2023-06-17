import {
  CanActivate,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: ConsoleLogger,
  ) {
    logger.setContext(PermissionsGuard.name);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const user = context.getArgs()[0].user;

    if (!requiredPermissions || !requiredPermissions.length) {
      return true;
    }

    const allow = requiredPermissions.every((requiredPermission) =>
      user.permissions.includes(requiredPermission),
    );

    const permissionsDescription = `has: [${user.permissions}], required: [${requiredPermissions}]`;
    this.logger.log(
      `user ${user.sub} ${
        allow ? 'has' : 'lacks'
      } required permissions (${permissionsDescription})`,
    );

    return allow;
  }
}
