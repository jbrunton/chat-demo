import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from './permissions/permissions.decorator';
import { PermissionsGuard } from './permissions/permissions.guard';

export const Auth = (...roles: string[]) =>
  applyDecorators(
    Permissions(...roles),
    UseGuards(AuthGuard('jwt'), PermissionsGuard),
  );
