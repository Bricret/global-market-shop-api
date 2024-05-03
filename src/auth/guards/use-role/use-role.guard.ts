import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommonService } from '../../../common/common.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UseRoleGuard implements CanActivate {

  constructor(

    private readonly reflector: Reflector,

    private readonly commonService: CommonService,

  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if ( !user ) this.commonService.handleExceptions( 'User not found', 'NF' );

    for ( const role of user.roles ) {
      if ( roles.includes(role) ) return true;
    }

    this.commonService.handleExceptions( `User ${ user.fullName } need a valid role: [${ roles }]`, 'FB' );
  }
}
