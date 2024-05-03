import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommonService } from '../../../common/common.service';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UseRoleGuard implements CanActivate {

  constructor(

    private readonly reflector: Reflector,

    private readonly commonService: CommonService,

  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const roles: string[] = this.reflector.get<string[]>( META_ROLES, context.getHandler() );

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if ( !user ) this.commonService.handleExceptions( 'User not found', 'NF' );

    for ( const role of user.roles ) {
      if ( roles.includes(role) ) return true;
    }

    console.log(roles, user.roles);

    this.commonService.handleExceptions( `User ${ user.fullName } need a valid role: [${ roles }]`, 'FB' );
  }
}
