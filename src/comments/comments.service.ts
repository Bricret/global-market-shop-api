import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { CommonService } from 'src/common/common.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/auth/entities/user.entity';


@Injectable()
export class CommentsService {

  constructor(

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    private readonly commonService: CommonService,

  ) {}

  async create( createCommentDto: CreateCommentDto, user: User ) {

    const { date, businessId, productId } = createCommentDto

    if ( !businessId && !productId ) this.commonService.handleExceptions( 'You must provide a business or product id', 'BR' )
    if ( !date ) createCommentDto.date = new Date();

    let comment

    if ( businessId ) {
       comment = this.commentRepository.create({
        ...createCommentDto,
        user,
        business: { id: businessId }
      });
    }

    if ( productId ) {
      comment = this.commentRepository.create({
        ...createCommentDto,
        user,
        product: { id: productId }
      });
    }
    
    await this.commentRepository.save(comment);

    return {
      message: 'Comment created successfully',
    }

  }

  async findAll( paginationDto: PaginationDto ) {
    
    const { limit = 10, offset = 0 } = paginationDto

    const comments = await this.commentRepository.find({
      take: limit,
      skip: offset,
      relations: { user: true }
    });

    return comments.map( ({ user, ...rest }) => ({
      ...rest,
      User: user.id
    }));

  }

  async findOne(id: string) {

    const commentFind = await this.commentRepository.findOneBy({ id });

    if (!commentFind) this.commonService.handleExceptions('Comment not found', 'NF');

    return commentFind;

  }

  async update( id: string, updateCommentDto: UpdateCommentDto, user: User ) {

    const { date, content } = updateCommentDto;

    const preComment = await this.commentRepository.preload({ id, date, content });
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if ( comment.user.id !== user.id ) {
     this.commonService.handleExceptions('You are not authorized to update this comment', 'UE');
    }

    return await this.commentRepository.save( {
      ...preComment,
      date: new Date(),
    } );

  }

  async remove( id: string ) {

    await this.findOne( id );

    return await this.commentRepository.delete( id );

  }

  //TODO: Add relations with products and business entities
}
