import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';

import { Auth } from 'src/auth/decorators';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Product } from './entities';


@ApiTags('Products')
@Controller('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth( ValidRoles.admin )
  @ApiResponse({ status: 201, description: 'Product was created successfully.', type: Product })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Token related' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.productsService.findAll( paginationDto );
  }

  @Get(':term')
  findOne( @Param( 'term' ) term: string ) {
    return this.productsService.findOnePlane( term );
  }

  @Patch(':id')
  @Auth( ValidRoles.admin )
  update(
    @Param( 'id', ParseUUIDPipe ) id: string, 
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update( id, updateProductDto );
  }

  @Delete( ':id' )
  @Auth( ValidRoles.admin )
  remove( @Param( 'id', ParseUUIDPipe ) id: string ) {
    return this.productsService.remove(id);
  }
}
