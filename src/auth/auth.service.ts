import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly commonService: CommonService

  ) {}


  async create( createUserDto: CreateUserDto) {

    try {
      
      const user = this.userRepository.create( createUserDto );
      await this.userRepository.save( user );

      return user;

    } catch (error) {
      this.commonService.handleExceptions(error.detail, 'BR');
    }

  }

}
