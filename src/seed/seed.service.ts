import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';



@Injectable()
export class SeedService {
 
  constructor(
    private readonly productService: ProductsService
  ) {}

  async runSeed() {

    await this.insertNewProducts();

    return 'SEED EXECUTE';
  }

  private async insertNewProducts() {

    await this.productService.deleteAllProducts();

    const products = initialData.products

    const insertPromises: any = []

    products.map( async product => {
      insertPromises.push( await this.productService.create(product) )
    })

    await Promise.all( insertPromises )



    return true;
  }

}
