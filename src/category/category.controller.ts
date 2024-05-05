import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.categoryService.findAll( paginationDto );
  }

  @Get(':id')
  findOne( @Param( 'id', ParseUUIDPipe ) term: string ) {
    return this.categoryService.findOne( term );
  }

  @Patch(':id')
  @Auth( ValidRoles.user )
  update(
    @Param( 'id', ParseUUIDPipe ) id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update( id, updateCategoryDto );
  }

  @Delete(':id')
  @Auth( ValidRoles.user )
  remove( @Param( 'id', ParseUUIDPipe ) id: string ) {
    return this.categoryService.remove( id );
  }
}
