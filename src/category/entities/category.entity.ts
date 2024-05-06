import { ApiProperty } from "@nestjs/swagger";
import { Business } from "src/business/entities/business.entity";
import { Product } from "src/products/entities";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'categories'
})
export class Category {

    @ApiProperty({
        example: '5ae8ca80-0607-41ba-b36c-aee95929c957',
        description: 'Unique identifier for the category'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Name of the category',
        uniqueItems: true
    })
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
