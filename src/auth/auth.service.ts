import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';

import * as bcrypt from 'bcrypt'

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

}
