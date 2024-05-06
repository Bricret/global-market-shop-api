import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class PaginationDto {

    @ApiProperty({
        default: 10,
        description: 'The number of items to return',
        required: false,
    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number )
    limit?: number;


    @ApiProperty({
        default: 0,
        description: 'The number of items to skip before starting to collect the result set',
        required: false,
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number )
    offset?: number;

}