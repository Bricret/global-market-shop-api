import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from 'src/common/common.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities';
import { Category } from 'src/category/entities/category.entity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([ 
      Product, 
      ProductImage,
      Category,
    ]),
    CommonModule,
    AuthModule,
  ],
  exports: [
    ProductsService,
  ]
})
export class ProductsModule {}
