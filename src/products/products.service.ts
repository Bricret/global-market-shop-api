import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';

import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger( 'ProductsService' )

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
       const { images = [], ...productDetails } = createProductDto;

       const product = this.productRepository.create({
         ...productDetails,
         images: images.map(image => this.productImageRepository.create({ url: image }))
       });
   
       await this.productRepository.save(product);
   
       return { ...product, images };
    } catch (error) {
       this.handleExceptions(error);
    }
   }   

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true }
    })

    return products.map( ({ images, ...rest }) => ({
      ...rest,
      images: images.map( ({ url }) => url )
    }))

  }

  async findOne( term: string ) {

    let product: Product;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); 
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne();
    }


    if ( !product ) 
      this.handleExceptions(`Product with ${ term } not found`);

    return product;
  }

  async findOnePlane( term: string ) {

    const { images = [], ...rest } = await this.findOne( term );

    return {
      ...rest,
      images: images.map( ({ url }) => url ),
    }
  }


  async update( id: string, updateProductDto: UpdateProductDto ) {

    const { images, ...toUpdate } = updateProductDto

    const product = await this.productRepository.preload({ id, ...toUpdate })

    if ( !product ) throw new NotFoundException( 'Product not found' )

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {

      if ( images ) {
        await queryRunner.manager.delete( ProductImage, { product: { id } })

        product.images = images.map(
          url => this.productImageRepository.create({ url })
        )
      }

      await queryRunner.manager.save( product )
      await queryRunner.commitTransaction()
      await queryRunner.release()

      return this.findOnePlane( id )

    } catch (error) {

      await queryRunner.rollbackTransaction()
      this.handleExceptions( error )
    }

  }

  async remove( id: string ) {

    this.findOne( id )
     
    return await this.productRepository.delete( id )
  }

  private handleExceptions( error: any ) {

    if ( error.code === '23505' ) throw new BadRequestException( error.detail )

    this.logger.error( error )
    throw new InternalServerErrorException( 'Unexpected error, check server logs' )
  }

  async deleteAllProducts() {
    const queryProduct = this.productRepository.createQueryBuilder('prod');


    try {
      await queryProduct
        .delete()
        .where({})
        .execute();
      
      return true;
    } catch (error) {
      this.handleExceptions( error )
    }
  }

}

