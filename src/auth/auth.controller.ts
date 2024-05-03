import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, Body, Get, UseGuards, Headers, SetMetadata } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { UseRoleGuard } from './guards/use-role/use-role.guard';


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
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards( AuthGuard(), UseRoleGuard )
  privateRoute2(
    @GetUser() user: User,
  ) {


    return {
      ok: true,
      user,
    }

  }

}
