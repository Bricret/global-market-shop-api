import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from ".";

@Entity()
export class ProductSize {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    size: string

    @Column( 'text')
    gender: string

    @ManyToMany(
        () => Product,
        ( product ) => product.sizes,
    )
    product: Product[]

}