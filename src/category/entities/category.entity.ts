import { Business } from "src/business/entities/business.entity";
import { Product } from "src/products/entities";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'categories'
})
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    name: string;

    @ManyToMany(
        () => Business,
        business => business.categories
    )
    businesses?: Business[];

    @ManyToMany(
        () => Product,
        product => product.categories
    )
    products?: Product[];
}
