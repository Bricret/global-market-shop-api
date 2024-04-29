import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { Business } from './entities/business.entity';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService],
  imports: [
    TypeOrmModule.forFeature([ Business ])
  ]
})
export class BusinessModule {}
