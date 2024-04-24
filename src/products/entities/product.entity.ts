import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage, ProductSize } from "./index";


@Entity()
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

    @ManyToMany(
        () => ProductSize,
        (productSize) => productSize.product,
        { cascade: true }
    )
    @JoinTable()
    sizes?: ProductSize

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true }
    )
    images?: ProductImage

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
