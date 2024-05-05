import { User } from "src/auth/entities/user.entity";
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
}
