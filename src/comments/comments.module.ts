import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Comment } from './entities/comment.entity';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([ 
      Comment,
    ]),
    AuthModule
  ]
})
export class CommentsModule {}
