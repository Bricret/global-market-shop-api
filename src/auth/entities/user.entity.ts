import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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

}
