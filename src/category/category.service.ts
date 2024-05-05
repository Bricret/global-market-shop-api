import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Injectable()
export class CategoryService {

  constructor(

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly commonService: CommonService,

  ) {

  }

  async create(createCategoryDto: CreateCategoryDto) {

    const name = createCategoryDto.name.toLowerCase();

    try {
      const category = this.categoryRepository.create({ name });

      await this.categoryRepository.save( category );

      return category;
      
    } catch (error) {
      this.commonService.handleExceptions( error.detail, 'BR' );
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto

    const categories = await this.categoryRepository.find({
      take: limit,
      skip: offset,
    });

    return categories;

  }

  async findOne( term: string ) {

    try {
      const categoryFind = await this.categoryRepository.findOneBy({ id: term })

      if ( !categoryFind ) throw new Error(`Category with ${ term } not found`);
  
      return categoryFind;
    } catch (error) {
      this.commonService.handleExceptions( 'Category not found, check ID', 'NF' );
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {

    const categories = await this.categoryRepository.preload( { id, ...updateCategoryDto } );

    if ( !categories ) this.commonService.handleExceptions( 'Business not found, check ID', 'NF' );

    try {

      await this.categoryRepository.save( categories );
      return categories;

    } catch (error) {
      this.commonService.handleExceptions( error.detail, 'BR' );
    }
  }

  async remove( id: string ) {

    await this.findOne( id );

    try {
      await this.categoryRepository.delete( id );
    } catch (error) {
      this.commonService.handleExceptions( error.detail, 'BR' );
    }

    return { message: 'Category deleted successfully' };

  }
}
