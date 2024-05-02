import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";


type MessageType = 'NF' | 'BR' | 'UE' | 'Def';

@Injectable()
export class CommonService {



  private readonly logger = new Logger( 'CommonService' )
    

  handleExceptions( error: any, type: MessageType ) {

    console.log( error )

    switch ( type ) {
        
        case 'NF':
          this.logMessage( error )
          throw new NotFoundException( error )
          break
  
        case 'BR':
          this.logMessage( error )
          throw new BadRequestException( error )
          break

        case 'UE':
          this.logMessage( error )
          throw new UnauthorizedException( error )
          break
  
        default:
          this.logMessage( error )
          throw new InternalServerErrorException( 'Unexpected error, check server logs' )
          break
    }
  }

  private logMessage( message: string ) {
    this.logger.log( message )
  }
}