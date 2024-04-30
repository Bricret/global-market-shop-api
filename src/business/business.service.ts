import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Business } from './entities/business.entity';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Injectable()
export class BusinessService {

  constructor(

    private readonly commonService: CommonService,

    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,

  ) {}

  async create(createBusinessDto: CreateBusinessDto) {

    const { products, ...rest } = createBusinessDto;

    await this.findOne( rest.name );

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

  async findOne( term: string ) {

    const queryBuilder = this.businessRepository.createQueryBuilder('prod'); 
    const business = await queryBuilder
      .where('UPPER(name) =:name', {
        name: term.toUpperCase(),
      }).getOne();

      if ( business ) throw new BadRequestException(`Business with ${ term } already exists`);

    return business;
  }

  update(id: string, updateBusinessDto: UpdateBusinessDto) {
    return `This action updates a #${id} business`;
  }

  remove(id: number) {
    return `This action removes a #${id} business`;
  }
}
