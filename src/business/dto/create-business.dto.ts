import { IsArray, IsBoolean, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateBusinessDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    description: string;

    @IsInt()
    @IsPositive()
    phone: number;

    @IsString()
    @IsOptional()
    email?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    products?: string[];

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    categories?: string[];
    
}