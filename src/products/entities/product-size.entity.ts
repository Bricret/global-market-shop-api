import { Column, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from ".";


export class ProductSize {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { 
        array: true
    })
    size: string[]

    @Column( 'text', {
        array: true,
        default: 'unisex',
    })
    gender: string[]

    @ManyToMany(
        () => Product,
        ( product ) => product.sizes,
    )
    product: Product[]

}