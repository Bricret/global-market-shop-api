import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators';
import { SeedService } from './seed.service';
import { ValidRoles } from 'src/auth/interfaces';


@ApiTags('Seed')
@Controller('seed')
export class SeedController {

  constructor(
    
    private readonly seedService: SeedService
  ) {}

  @Get()
  @Auth( ValidRoles.admin )
  executeSeed() {
    return this.seedService.runSeed();
  }
}
