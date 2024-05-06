import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Category } from "src/category/entities/category.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'business'
})
export class Business {

    @ApiProperty({
        description: 'Name of the business',
        required: true,
        minLength: 1
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Name of the business',
        required: true,
        minLength: 1
    })
    @Column('text', {
        unique: true,
    })
    name: string;

    @ApiProperty({
        description: 'Slug of the business',
        required: false
    })
    @Column('text', {
        unique: true,
        nullable: false,
    })
    slug?: string;

    @ApiProperty({
        description: 'Address of the business',
        required: true
    })
    @Column('text')
    address: string;

    @ApiProperty({
        description: 'City of the business',
        required: true
    })
    @Column('text')
    city: string;

    @ApiProperty({
        description: 'Description of the business',
        required: true
    })
    @Column('text')
    description: string;

    @ApiProperty({
        description: 'Phone number of the business',
        required: true
    })
    @Column('int')
    phone: number;

    @ApiProperty({
        description: 'Email of the business',
        required: false
    })
    @Column('text',{
        nullable: true
    })
    email?: string;

    @ApiProperty({
        description: 'Is the business active?',
        required: false,
        default: true
    })
    @Column('boolean', {
        default: true
    })
    is_active?: boolean;

    @OneToMany(
        () => Product,
        ( product ) => product.business,
        { cascade: true, eager: true }
    )
    products?: Product[];

    @ManyToMany(
        () => Category,
        category => category.businesses,
        { cascade: true }
    )
    @JoinTable() 
    categories: Category[];

    @ApiProperty({
        description: 'User that created the business',
        required: true
    })
    @ManyToOne(
        () => User,
        ( user ) => user.businesses,
        { onDelete: 'CASCADE' }
    )
    user: User;

    @OneToMany(
        () => Comment,
        ( comment ) => comment.business,
        { eager: true, cascade: true }
    )
    comments: Comment[];

    @BeforeInsert()
    checkSlugInsert() {
        if ( !this.slug ) {
            this.slug = this.name
        }

        this.slug = this.slug
        .toLowerCase().trim()
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
