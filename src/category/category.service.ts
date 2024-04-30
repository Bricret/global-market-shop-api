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
      this.commonService.handleExceptions(error, 'BR');
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto

    const categories = await this.categoryRepository.find({
      take: limit,
      skip: offset,
      // relations: { businesses: true }
    });

    return categories;

    //! This is the correct way to return the data when using relations
    // return categories.map( ({ businesses, ...rest }) => ({
    //   ...rest,
    //   businesses: businesses.map( ( business ) => business )
    // }));

  }

  async findOne( term: string ) {

    const categoryFind = await this.categoryRepository.findOneBy({ id: term })

    if ( !categoryFind ) this.commonService.handleExceptions(`Category with ${ term } not found`, 'NF');

    return categoryFind;

  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {

    const categories = await this.categoryRepository.preload( { id, ...updateCategoryDto } );

    if ( !categories ) this.commonService.handleExceptions( 'Business not found, check ID', 'NF' );

    await this.categoryRepository.save( categories );

    return categories;

  }

  async remove( id: string ) {

    this.findOne( id );

    await this.categoryRepository.delete( id );

    return { message: 'Category deleted successfully' };

  }
}
