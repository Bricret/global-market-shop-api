import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Business } from './entities/business.entity';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';


@Injectable()
export class BusinessService {

  constructor(

    private readonly commonService: CommonService,

    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

  ) {}

  async create(createBusinessDto: CreateBusinessDto) {

    const { products, categories, ...rest } = createBusinessDto;

    await this.findOneWhoDontExist( rest.name );

    const business = this.businessRepository.create({
      ...rest,
      products: products?.map( product => ({ id: product }) ),
      categories: categories?.map( category => ({ id: category }) ),
    });

    await this.businessRepository.save( business ); 

    return business;

  }

  async findAll( paginationDto: PaginationDto ) {
    
    const { limit = 10, offset = 0 } = paginationDto

    const business = await this.businessRepository.find({
      take: limit,
      skip: offset,
      relations: { products: true }
    });

    return business.map( ({ products, ...rest }) => ({
      ...rest,
      products: products.map( ( product ) => product.id )
    }));

  }

  async findOneWhoDontExist( term: string ) {

    const queryBuilder = this.businessRepository.createQueryBuilder('prod'); 
    const business = await queryBuilder
      .where('UPPER(name) =:name or slug =:slug', {
        name: term.toUpperCase(),
        slug: term.toLowerCase(),
      }).getOne();

      if ( business ) this.commonService.handleExceptions(`Business with ${ term } already exists`, 'BR');

    return business;
  }

  async findOneWhenExist( term: string ) {
    let business: Business;

    if ( isUUID(term) ) {
      business = await this.businessRepository.findOneBy({ id: term });
    } else {
    const queryBuilder = this.businessRepository.createQueryBuilder('busi'); 
    business = await queryBuilder
      .where('UPPER(name) =:name or slug =:slug', {
        name: term.toUpperCase(),
        slug: term.toLowerCase(),
      })
      .leftJoinAndSelect('busi.products','busiProducts')
      .getOne()
    }
      if ( !business ) this.commonService.handleExceptions( `Business with ${ term } does not exist`, 'NF' );

    return {
      ...business,
      products: business.products.map( ({ id }) => id )
    };
  }

  async update( id: string, updateBusinessDto: UpdateBusinessDto ) {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { products, categories, ...rest } = updateBusinessDto;

    const business = await this.businessRepository.preload( { id, ...rest } );
    if ( !business ) this.commonService.handleExceptions( 'Business not found, check ID', 'NF' );

    if (categories) {
      const categoriesFindPromises = categories.map(async (category) => {
         try {

           const categoryFind = await this.categoryRepository.findOneBy({ id: category });
           if (!categoryFind) throw new Error(`Category with ID ${category} not found`);

           return categoryFind;
         } catch (error) {
           this.commonService.handleExceptions(error.message, 'BR');
         }
      });
     
      try {

        const categoriesFind = await Promise.all(categoriesFindPromises);
        business.categories = categoriesFind;

      } catch (error) {
        this.commonService.handleExceptions(error.message, 'BR');
      }
    }
    await this.businessRepository.save(business);
    return business;
  }

  async remove( id: string ) {

    this.findOneWhenExist( id );

    await this.businessRepository.delete( id );

    return { message: `Business with Id ${ id } is deleted` };

  }



}
