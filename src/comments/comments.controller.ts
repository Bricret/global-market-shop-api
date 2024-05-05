import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';

import { Auth, GetUser } from 'src/auth/decorators';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Auth( ValidRoles.user)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.create( createCommentDto, user );
  }

  @Get()
  findAll( 
    @Query() paginationDto: PaginationDto 
  ) {
    return this.commentsService.findAll( paginationDto );
  }

  @Patch('update/ :id')
  @Auth( ValidRoles.user )
  update(
    @Param('id') id: string, 
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.update( id, updateCommentDto, user);
  }

  @Delete(':id')
  @Auth( ValidRoles.user )
  remove( @Param('id', ParseUUIDPipe ) id: string) {
    return this.commentsService.remove(id);
  }
}
