import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Business } from "src/business/entities/business.entity";
import { Category } from "src/category/entities/category.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { ProductImage } from "./index";


@Entity({
    name: 'products'
})
export class Product {

    @ApiProperty({
        example: "161e7bf6-cca0-4e7c-a24c-b0f7802a6f4b",
        description: "The unique identifier of the product",
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ApiProperty({
        example: "Nike Air Max 90",
        description: "The title of the product",
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: "The Nike Air Max 90 is a classic sneaker.",
        description: "The description of the product",
    })
    @Column('text')
    description: string;

    @ApiProperty({
        example: 100.00,
        description: "The price of the product",
    })
    @Column('float', {
        unique: false,
        default: 0,
    })
    price: number;

    @ApiProperty({
        example: "nike_air_max_90",
        description: "The slug of the product",
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 100,
        description: "The stock of the product",
    })
    @Column('int', {
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example: ["XL", "L", "M", "S"],
        description: "The sizes of the product",
        nullable: true,
        required: false
    })
    @Column('text', {
        array: true,
        nullable: true
    })
    sizes?: string[]

    @ApiProperty({
        example: "men",
        description: "gender of the product",
        nullable: true,
        required: false
    })
    @Column('text', {
        nullable: true
    })
    gender?: string

    @ApiProperty({
        example: true,
        description: "The status of the product",
    })
    @Column('boolean', {
        default: true
    })
    is_active: boolean;

    @ApiProperty()
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

    @ManyToMany(
        () => Category,
        category => category.businesses,
        { cascade: true }
    )
    @JoinTable() 
    categories: Category[];

    @ApiProperty()
    @OneToMany(
        () => Comment,
        (comment) => comment.product,
        { cascade: true }
    )
    comments: Comment[]

    
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
