import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductImage, Product, ProductSize } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger( 'ProductsService' )

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    @InjectRepository(ProductSize)
    private readonly productSizeRepository: Repository<ProductSize>

  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
       const { sizes = [], images = [], gender, ...productDetails } = createProductDto;
   
       // Busca o crea los tamaños
       const findOrCreateSizes = await Promise.all(sizes.map(async ( size ) => {
         let sizeEntity = await this.productSizeRepository.findOne({ where: { size, gender } });
         if (!sizeEntity) {
           sizeEntity = this.productSizeRepository.create({ size, gender });
           await this.productSizeRepository.save(sizeEntity);
         }
         return sizeEntity;
       }));
   
       // Crea las imágenes
       const productImages = images.map(image => this.productImageRepository.create({ url: image }));
   
       // Crea el producto con los tamaños y las imágenes
       const product = this.productRepository.create({
         ...productDetails,
         sizes: findOrCreateSizes,
         images: productImages,
       });
   
       await this.productRepository.save(product);
   
       return { ...product, images, sizes, gender };
    } catch (error) {
       this.handleExceptions(error);
    }
   }
   

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
        sizes: true,
      }
    })

    return products.map( ({ images, sizes, ...rest }) => ({
      ...rest,
      images: images.map( ({ url }) => url ),
      sizes: sizes.map( ({ size, gender }) => ({ size, gender }))
    }))

  }

  async findOne( term: string ) {

    try {

      let product: Product

      if ( isUUID( term ) ) {
        product = await this.productRepository.findOneBy({ id: term })
      } else {
        const queryBilder = this.productRepository.createQueryBuilder('prod');
        product = await queryBilder
          .where(`LOWER(title) = LOWER(:title) or slug = :slug`, {
            title: term,
            slug: term
          })
          .leftJoinAndSelect('prod.sizes', 'prodSizes')
          .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne() 
      }

      if ( !product ) throw new NotFoundException( 'Product not found' )
      return product

    } catch (error) {
      this.handleExceptions( error )
    }
  }

  async findOnePlane( term: string ) {

    const { images = [], sizes = [], ...rest } = await this.findOne( term );

    return {
      ...rest,
      images: images.map( ({ url }) => url ),
      sizes: sizes.map(({ size, gender }) => ({ size, gender }))
    }
  }


  async update( id: string, updateProductDto: UpdateProductDto ) {

    return `This action updates a #${id} product`
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
