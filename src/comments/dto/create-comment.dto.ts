import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateCommentDto {

    @ApiProperty({
        description: 'The content of the comment',
        maxLength: 100,
        minLength: 5,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(5)
    content: string;

    @ApiProperty({
        description: 'The date of the comment',
        format: 'date',
        nullable: true,
    })
    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    date?: Date;

    @ApiProperty({
        description: 'The id of the user',
        uniqueItems: true,
        nullable: true,
        required: false,
    })
    @IsString()
    @IsOptional()
    businessId?: string;

    @ApiProperty({
        description: 'The id of the business',
        uniqueItems: true,
        nullable: true,
        required: false,
    })
    @IsString()
    @IsOptional()
    productId?: string;

}
