import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(5)
    content: string;

    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    date?: Date;

    @IsString()
    @IsOptional()
    businessId?: string;

    @IsString()
    @IsOptional()
    productId?: string;

}
