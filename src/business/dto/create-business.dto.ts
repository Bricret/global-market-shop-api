import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateBusinessDto {

    @ApiProperty({
        description: 'Name of the business',
        required: true,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        description: 'Slug of the business',
        required: false
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Address of the business',
        required: true
    })
    @IsString()
    address: string;

    @ApiProperty({
        description: 'City of the business',
        required: true
    })
    @IsString()
    city: string;

    @ApiProperty({
        description: 'Description of the business',
        required: true
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Phone number of the business',
        required: true
    })
    @IsInt()
    @IsPositive()
    phone: number;

    @ApiProperty({
        description: 'Email of the business',
        required: false
    })
    @IsString()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Is the business active?',
        required: false,
        default: true
    })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;


    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    products?: string[];

    @IsString({ each: true })
    @IsArray()
    categories: string[];
    
}