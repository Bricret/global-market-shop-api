import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./index";
import { Business } from "src/business/entities/business.entity";


@Entity({
    name: 'products'
})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('text')
    description: string;

    @Column('float', {
        unique: false,
        default: 0,
    })
    price: number;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0,
    })
    stock: number;

    @Column('text', {
        array: true,
        nullable: true
    })
    sizes?: string[]

    @Column('text', {
        nullable: true
    })
    gender?: string

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => Business,
        (business) => business.products,
        { onDelete: 'CASCADE' }
    )
    business: Business;

    
    @BeforeInsert()
    checkSlugInsert() {
        if ( !this.slug ) {
            this.slug = this.title
        }

        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", "")
        
    }


    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", "")
    }

} 
