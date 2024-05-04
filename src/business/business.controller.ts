import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';



@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @Auth( ValidRoles.admin )
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto ) {
    return this.businessService.findAll( paginationDto );
  }

  @Get(':term')
  findOne( @Param( 'term' ) term: string ) {
    return this.businessService.findOneWhenExist( term );
  }

  @Patch(':id')
  @Auth( ValidRoles.admin )
  update(
    @Param( 'id', ParseUUIDPipe ) id: string, 
    @Body() updateBusinessDto: UpdateBusinessDto
  ) {
    return this.businessService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.admin )
  remove( @Param( 'id', ParseUUIDPipe ) id: string ) {
    return this.businessService.remove(id);
  }
}
