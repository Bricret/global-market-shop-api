import { AuthGuard } from '@nestjs/passport';
import { UseGuards, applyDecorators } from '@nestjs/common';

import { RoleProtected } from './role-protected.decorator';
import { UseRoleGuard } from '../guards/use-role/use-role.guard';
import { ValidRoles } from '../interfaces';



export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected( ...roles),  
    UseGuards(AuthGuard(), UseRoleGuard ),
  );
}