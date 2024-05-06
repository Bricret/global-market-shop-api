import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Business } from "src/business/entities/business.entity";
import { Product } from "src/products/entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "comments",
})
export class Comment {

    @ApiProperty({
        example: '5ae8ca80-0607-41ba-b36c-aee95929c957',
        description: 'The id of the comment',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'The content of the comment',
        maxLength: 100,
        minLength: 5,
    })
    @Column({
        length: 100,
    })
    content: string;

    @ApiProperty({
        description: 'The date of the comment',
        format: 'date',
    })
    @Column({
        type: 'date',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false,
    })
    date: Date;

    @ApiProperty({
        example: '5ae8ca80-0607-41ba-b36c-aee95929c957',
        description: 'The id of the user',
        uniqueItems: true,
    })
   @ManyToOne(
        () => User,
        ( user ) => user.comments,
        { onDelete: 'CASCADE' }
    )
    user: User;


    @ApiProperty({
        example: '5ae8ca80-0607-41ba-b36c-aee95929c957',
        description: 'The id of the business',
        uniqueItems: true,
        nullable: true,
        required: false,
    })
    @ManyToOne(
        () => Business,
        ( business ) => business.comments,
        { onDelete: 'CASCADE' }
    )
    business: Business;

    @ApiProperty({
        example: '5ae8ca80-0607-41ba-b36c-aee95929c957',
        description: 'The id of the product',
        uniqueItems: true,
        nullable: true,
        required: false,
    })
    @ManyToOne(
        () => Product,
        ( product ) => product.comments,
        { onDelete: 'CASCADE' }
    )
    product: Product;
}
