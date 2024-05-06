import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";



export class CreateCategoryDto {

    @ApiProperty({
        description: 'Name of the category',
        uniqueItems: true
    })
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    name: string;

}
