import { ApiTags } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { fileFilter, fileNamer } from './helpers';
import { FilesService } from './files.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';


@ApiTags('Files')
@Controller('files')
export class FilesController {

  constructor( 
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  getstaticImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getstaticImage( imageName );
    res.sendFile( path );
  }


  @Post('product')
  @Auth( ValidRoles.user )
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
      
    })
  }) )

  
  upLoadFile( 
    @UploadedFile() file: Express.Multer.File
  ) {

    if ( !file ) throw new BadRequestException('Make sure that the file is a image file');

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

    return { secureUrl }

  } 
}
