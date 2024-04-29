import { Product } from "src/products/entities";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'business'
})
export class Business {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    name: string;

    @Column('text')
    address: string;

    @Column('text')
    city: string;

    @Column('text')
    description: string;

    @Column('int')
    phone: number;

    @Column('text',{
        nullable: true
    })
    email: string;

    @OneToMany(
        () => Product,
        ( product ) => product.business,
        { cascade: true, eager: true }
    )
    products: Product[]
}
