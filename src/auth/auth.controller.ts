import { Controller, Post, Body, Get } from '@nestjs/common';


import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces';
import { ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
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

  @Get('check-auth-status')
  @Auth( ValidRoles.user )
  @ApiResponse({ status: 201, description: 'Product was created successfully.', type: User })
  @ApiResponse({ status: 403, description: 'Token related' })
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user )
  }

}
