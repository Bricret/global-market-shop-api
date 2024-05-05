import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CommentsService {

  constructor(

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    private readonly commonService: CommonService,

  ) {}

  async create( createCommentDto: CreateCommentDto, user: User ) {

    const { date } = createCommentDto

    if ( !date ) createCommentDto.date = new Date();

    const comment = this.commentRepository.create({
      ...createCommentDto,
      user
    });

    const newComment = await this.commentRepository.save(comment);

    return {
      ...newComment,
      user: user.id
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
}
