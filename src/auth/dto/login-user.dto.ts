import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";



export class LoginUserDto {

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

}