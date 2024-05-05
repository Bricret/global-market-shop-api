import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';

import { CreateProductDto, UpdateProductDto } from './dto';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductImage, Product } from './entities';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductsService {


  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly dataSource: DataSource,

    private readonly commonService: CommonService,

  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], business, categories = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        business: { id: business },
        categories: categories.map( category => ({ id: category }) )
      });

      await this.productRepository.save( product );

      return { ...product, images, business, categories };
    } catch (error) {
       this.commonService.handleExceptions( error.message, 'BR' )
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true, business: true, categories: true }
    })

    return products.map( ({ images, business, ...rest }) => ({
      ...rest,
      images: images.map( ({ url }) => url ),
      business: business.id,
    }))

  }

  async findOne( term: string ) {

    let product: Product;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOne({
        where: { id: term },
        relations: [ 'images', 'business', 'categories' ]
      });
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
      this.commonService.handleExceptions( `Product with ${ term } not found`, 'NF' );

    return product;
  }

  async findOnePlane( term: string ) {

    const { images = [], business, ...rest } = await this.findOne( term );

    return {
      ...rest,
      images: images.map( ({ url }) => url ),
      business: business.id,
    }
  }


  async update( id: string, updateProductDto: UpdateProductDto ) {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images, business, categories, ...toUpdate } = updateProductDto
    const product = await this.productRepository.preload({ id, ...toUpdate })
    if ( !product ) this.commonService.handleExceptions( 'Product not found', 'NF' )

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
          product.categories = categoriesFind;
  
        } catch (error) {
          this.commonService.handleExceptions(error.message, 'BR');
        }
      }

      await queryRunner.manager.save( product )
      await queryRunner.commitTransaction()
      await queryRunner.release()

      return this.findOnePlane( id )

    } catch (error) {

      await queryRunner.rollbackTransaction()
      this.commonService.handleExceptions( error, 'BR' )
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
      this.commonService.handleExceptions( error, 'BR' )
    }
  }

}