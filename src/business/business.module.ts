import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { Business } from './entities/business.entity';
import { CommonModule } from 'src/common/common.module';
import { Category } from 'src/category/entities/category.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService],
  imports: [
    TypeOrmModule.forFeature([ 
      Business,
      Category, 
    ]),
    CommonModule,
    AuthModule,
  ],
})
export class BusinessModule {}
