
export const fileFilter = ( req: Express.Request, file: Express.Multer.File, cb: ( arg: any, arg2: boolean ) => void ) => {

// console.log({ file })
    if ( !file ) return cb( new Error('File is empty'), false );

    const fileExptension = file.mimetype.split('/')[1];
    const validExtension = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if ( validExtension.includes( fileExptension ) ) return cb( null, true );
    cb( null, false );

}