import { ApiProperty } from "@nestjs/swagger";
import { Business } from "src/business/entities/business.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @ApiProperty({
        example: "161e7bf6-cca0-4e7c-a24c-b0f7802a6f4b",
        description: "The unique identifier of the product",
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: "tes.testing@gmail.com",
        description: "The email of the user",
        uniqueItems: true
    })
    @Column('text', { 
      unique: true 
    })
    email: string;

    @ApiProperty({
        example: "password123",
        description: "The password of the user",
        nullable: false,
        minLength: 6,
        maxLength: 50,
    })
    @Column('text', {
        select: false,
    })
    password: string;

    @ApiProperty({
        example: "Tes Testing",
        description: "The full name of the user",
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        example: true,
        description: "The status of the user",
        default: true,
    })
    @Column('bool', {
        default: true,
    })
    is_active: boolean;

    @ApiProperty({
        example: "1234",
        description: "The verification code of the user",
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    address?: string;

    @ApiProperty({
        example: "12345678",
        description: "The verification code of the user",
        nullable: true,
    })
    @Column('numeric', {
        nullable: true,
        unique: true,
    })
    phone: number;

    @ApiProperty({
        example: "Chinandega",
        description: "The verification code of the user",
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    city: string;

    @ApiProperty({
        example: "user",
        description: "The roles of the user",
        nullable: true,
    })
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
