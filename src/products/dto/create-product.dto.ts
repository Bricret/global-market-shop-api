import { ApiProperty } from "@nestjs/swagger";
import { 
    IsArray, 
    IsBoolean, 
    IsIn, 
    IsInt, 
    IsNumber, 
    IsOptional, 
    IsPositive, 
    IsString, 
    MinLength 
} from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'The title of the product',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'The description of the product',
        nullable: false,
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'The price of the product',
        nullable: false,
        minimum: 0,
    })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({
        description: 'The slug of the product',
        nullable: true
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'The stock of the product',
        nullable: false,
        minimum: 0
    })
    @IsInt()
    @IsPositive()
    stock: number;

    @ApiProperty({
        description: 'The sizes of the product',
        nullable: true,
        required: false
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    sizes?: string[];

    @ApiProperty({
        description: 'The gender of the product',
        nullable: true,
        required: false
    })
    @IsIn(['men', 'women', 'kids', 'unisex'])
    @IsOptional()
    gender?: string;

    @ApiProperty({
        description: 'The color of the product',
        nullable: true,
        required: false,
        default: true
    })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @ApiProperty({
        description: 'The images of the product',
        nullable: true,
        required: true
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

    @ApiProperty({
        description: 'The business of the product',
        nullable: false,
        required: true
    })
    @IsString()
    business: string;

    @ApiProperty({
        description: 'The categories of the product',
        nullable: false,
        required: true
    })
    @IsString({ each: true })
    @IsArray()
    categories: string[];
}
