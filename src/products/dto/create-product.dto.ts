import { 
    IsArray, 
    IsIn, 
    IsInt, 
    IsNumber, 
    IsOptional, 
    IsPositive, 
    IsString, 
    MinLength 
} from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    sizes?: string[];

    @IsIn(['men', 'women', 'kids', 'unisex'])
    @IsOptional()
    gender?: string;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

    @IsString()
    business: string;

}
