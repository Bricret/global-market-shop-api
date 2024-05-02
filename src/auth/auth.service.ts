import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'


import { CommonService } from 'src/common/common.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';


@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly commonService: CommonService

  ) {}


  async create( createUserDto: CreateUserDto) {

    try {

      const { password,  ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });
      await this.userRepository.save( user );
      delete user.password;

      return user;
      //TODO: Retornar JWT  de acceso

    } catch (error) {
      this.commonService.handleExceptions(error.detail, 'BR');
    }

  }

  async loginUser( loginUserDto: LoginUserDto ) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });

    if ( !user ) this.commonService.handleExceptions( 'Credential are not valid (email)', 'UE' );

    if ( !bcrypt.compareSync( password, user.password ) ) {
      this.commonService.handleExceptions( 'Credential are not valid (password)', 'UE' );
    }

    return user;
    //TODO: Retornar JWT de acceso


  }

}
