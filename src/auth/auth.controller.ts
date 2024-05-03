import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, Body, Get, UseGuards, Headers } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UseRoleGuard } from './guards/use-role/use-role.guard';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {


  constructor(private readonly authService: AuthService) {}


  @Post('register')
  create( @Body() createUserDto: CreateUserDto ) {
    return this.authService.create( createUserDto );
  }


  @Post('login')
  loginUser( @Body() loginUserDto: LoginUserDto ) {
    return this.authService.loginUser( loginUserDto );
  }


  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string,
    @Headers() headers: IncomingHttpHeaders,
  ) {

    return {
      ok: true,
      message: 'This is a private route',
      user,
      userEmail,
      rawHeaders,
      headers,
    }
  }


  @Get('private2')
  @RoleProtected( ValidRoles.superUser )
  @UseGuards( AuthGuard(), UseRoleGuard )
  privateRoute2(
    @GetUser() user: User,
  ) {

    return {
      ok: true,
      user,
    }

  }

  @Get('private3')
  @Auth( ValidRoles.user )
  privateRoute3(
    @GetUser() user: User,
  ) {

    return {
      ok: true,
      user,
    }

  }

}
