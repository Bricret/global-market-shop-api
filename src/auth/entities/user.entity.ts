import { Business } from "src/business/entities/business.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { 
      unique: true 
    })
    email: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true,
    })
    is_active: boolean;

    @Column('text', {
        nullable: true,
    })
    address: string;

    @Column('numeric', {
        nullable: true,
        unique: true,
    })
    phone: number;

    @Column('text', {
        nullable: true,
    })
    city: string;

    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: string[];

    @OneToMany(
        () => Business,
        ( business ) => business.user,
        { cascade: true, eager: true }
    )
    businesses?: Business[];

    @OneToMany(
        () => Comment,
        ( comment ) => comment.user,
        { cascade: true, eager: true }
    )
    comments?: Comment[];


    @BeforeInsert()
    checkEmailBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkEmailBeforeUpdate() {
        this.checkEmailBeforeInsert();
    }

}
