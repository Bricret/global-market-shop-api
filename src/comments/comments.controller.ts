import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

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
