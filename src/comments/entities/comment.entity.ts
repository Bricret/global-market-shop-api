import { User } from "src/auth/entities/user.entity";
import { Business } from "src/business/entities/business.entity";
import { Product } from "src/products/entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "comments",
})
export class Comment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 100,
    })
    content: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false,
    })
    date: Date;

   @ManyToOne(
        () => User,
        ( user ) => user.comments,
        { onDelete: 'CASCADE' }
    )
    user: User;


    @ManyToOne(
        () => Business,
        ( business ) => business.comments,
        { onDelete: 'CASCADE' }
    )
    business: Business;

    @ManyToOne(
        () => Product,
        ( product ) => product.comments,
        { onDelete: 'CASCADE' }
    )
    product: Product;
}
