import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";



export class CreateUserDto {

    @ApiProperty({
        description: 'The email of the user',
        nullable: false,
        minLength: 6,
        maxLength: 50
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        nullable: false,
        minLength: 6,
        maxLength: 50,
        pattern: '/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'The full name of the user',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    fullName: string;

    @ApiProperty({
        description: 'The address of the user',
        nullable: true,
        required: false
    })
    @IsString()
    @MinLength(1)
    @IsOptional()
    address?: string;

    @ApiProperty({
        description: 'The phone number of the user',
        nullable: true,
        required: false
    })
    @IsNumber()
    @IsOptional()
    phone?: number;

    @ApiProperty({
        description: 'The city of the user',
        nullable: true,
        required: false
    })
    @IsString()
    @MinLength(1)
    @IsOptional()
    city?: string;

    @ApiProperty({
        description: 'The country of the user',
        nullable: true,
        required: false
    })
    @IsString({ each: true })
    @IsOptional()
    roles: string[];

}