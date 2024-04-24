import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger( 'ProductsService' )

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>

  ) {}

  async create(createProductDto: CreateProductDto)  {

    return 'This action adds a new product'
    // try {

    //   const Product = this.productRepository.create( createProductDto )

    //   await this.productRepository.save( Product )

    //   return Product

    // } catch (error) {
    //   this.handleExceptions( error )
    // }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto

    return await this.productRepository.find({
      take: limit,
      skip: offset
    })
  }

  async findOne( term: string ) {

    try {

      let product: Product

      if ( isUUID( term ) ) {
        product = await this.productRepository.findOneBy({ id: term })
      } else {
        const queryBilder = this.productRepository.createQueryBuilder();
        product = await queryBilder
          .where(`LOWER(title) = LOWER(:title) or slug = :slug`, {
            title: term,
            slug: term
          }).getOne() 
      }

      if ( !product ) throw new NotFoundException( 'Product not found' )
      return product

    } catch (error) {
      this.handleExceptions( error )
    }
  }

  async update( id: string, updateProductDto: UpdateProductDto ) {

    return 'This action updates a #${id} product'

    // const product = await this.productRepository.preload({
    //   id: id,
    //   ...updateProductDto
    // })

    // if ( !product ) throw new NotFoundException( 'Product not found' )

    // try {

    //   await this.productRepository.save( product )
    //   return product
    // } catch (error) {
    //   this.handleExceptions( error )
    // }

  }

  async remove( id: string ) {

    this.findOne( id )

    try {
      
      return await this.productRepository.delete( id )

    } catch (error) {
      this.handleExceptions( error )
    }
  }



  private handleExceptions( error: any ): never {

    if ( error.code === '23505' ) throw new BadRequestException( error.detail )

    this.logger.error( error )
    throw new InternalServerErrorException( 'Unexpected error, check server logs' )
  }

}
