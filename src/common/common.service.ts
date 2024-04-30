import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";


type MessageType = 'NF' | 'BR' | 'Def';

@Injectable()
export class CommonService {



  private readonly logger = new Logger( 'CommonService' )
    

  handleExceptions( error: any, type: MessageType ) {

    switch ( type ) {
        
        case 'NF':
          this.logMessage( error.message )
          throw new NotFoundException( error.message )
          break
  
        case 'BR':
          this.logMessage( error.message )
          throw new BadRequestException( error.message )
          break
  
        default:
          this.logMessage( error.message )
          throw new InternalServerErrorException( 'Unexpected error, check server logs' )
          break
    }
  }

  private logMessage( message: string ) {
    this.logger.log( message )
  }
}