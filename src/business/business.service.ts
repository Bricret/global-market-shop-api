import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Business } from './entities/business.entity';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';


@Injectable()
export class BusinessService {

  constructor(

    private readonly commonService: CommonService,

    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,

  ) {}

  async create(createBusinessDto: CreateBusinessDto) {

    const { products, ...rest } = createBusinessDto;

    await this.findOneWhenDontExist( rest.name );

    const business = this.businessRepository.create({
      ...rest,
      products: products?.map( product => ({ id: product }) )
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
      products: products.map( ( product ) => product )
    }));

  }

  async findOneWhenDontExist( term: string ) {

    const queryBuilder = this.businessRepository.createQueryBuilder('prod'); 
    const business = await queryBuilder
      .where('UPPER(name) =:name', {
        name: term.toUpperCase(),
      }).getOne();

      if ( business ) this.commonService.handleExceptions(`Business with ${ term } already exists`);

    return business;
  }

  async findOneWhenExist( term: string ) {
    let business: Business;

    if ( isUUID(term) ) {
      business = await this.businessRepository.findOneBy({ id: term });
    } else {
    const queryBuilder = this.businessRepository.createQueryBuilder('busi'); 
    business = await queryBuilder
      .where('UPPER(name) =:name', {
        name: term.toUpperCase(),
      })
      .leftJoinAndSelect('busi.products','busiProducts')
      .getOne()
    }
      if ( !business ) this.commonService.handleExceptions(`Business with ${ term } does not exist`);

    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { products, ...rest } = updateBusinessDto;

    const business = await this.businessRepository.preload( { id, ...rest } );

    if ( !business ) this.commonService.handleExceptions( 'Business not found, check ID' );

    await this.businessRepository.save( business );

    return business;

  }

  async remove( id: string ) {

    this.findOneWhenExist( id );

    await this.businessRepository.delete( id );

    return { message: `Business with Id ${ id } is deleted` };

  }



}
