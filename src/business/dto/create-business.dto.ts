import { IsArray, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateBusinessDto {

    @IsString()
    @MinLength(1)
    name: string;

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

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    products?: string[];
    
}