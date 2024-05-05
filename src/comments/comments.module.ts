import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Comment } from './entities/comment.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([ 
      Comment,
    ]),
    AuthModule,
    CommonModule,
  ]
})
export class CommentsModule {}
