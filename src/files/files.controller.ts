import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { fileFilter } from './helpers/fileFilter.helper';
import { FilesService } from './files.service';



@Controller('files')
export class FilesController {

  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
    storage: diskStorage({
      destination: './static/uploads',
      
    })
  }) )
  upLoadFile( 
    @UploadedFile() file: Express.Multer.File
  ) {

    if ( !file ) throw new BadRequestException('Make sure that the file is a image file');

    return {
      fileName: file.originalname
    }

  } 


}
