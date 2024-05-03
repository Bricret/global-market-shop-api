import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';



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
  testingPrivateRoute() {

    return {
      ok: true,
      message: 'This is a private route'
    }
  }

}
