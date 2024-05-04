import { User } from "src/auth/entities/user.entity";
import { Category } from "src/category/entities/category.entity";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column('text', {
        unique: true,
        nullable: false,
    })
    slug: string;

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
    email?: string;

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

    @ManyToOne(
        () => User,
        ( user ) => user.businesses,
        { cascade: true, eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if ( !this.slug ) {
            this.slug = this.name
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
