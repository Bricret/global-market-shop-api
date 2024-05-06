import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    ConfigModule,
    CommonModule,
    AuthModule,
  ]
})
export class FilesModule {}
