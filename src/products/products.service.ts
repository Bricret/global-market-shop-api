import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';

import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductImage, Product } from './entities';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger( 'ProductsService' )

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

    private readonly commonService: CommonService,

  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], business, ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        business: { id: business }
      });

      await this.productRepository.save( product );

      return { ...product, images };
    } catch (error) {
       this.commonService.handleExceptions( error )
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true, business: true }
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
      this.commonService.handleExceptions(`Product with ${ term } not found`);

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

    const { images, business, ...toUpdate } = updateProductDto
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
      this.commonService.handleExceptions( error )
    }

  }

  async remove( id: string ) {

    this.findOne( id )
    return await this.productRepository.delete( id )
    
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
      this.commonService.handleExceptions( error )
    }
  }

}