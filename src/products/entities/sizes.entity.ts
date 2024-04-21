import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Sizes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        array: true,
    })
    size: string[];

    @Column('text')
    gender: string;



}