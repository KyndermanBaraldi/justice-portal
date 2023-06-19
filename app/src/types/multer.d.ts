declare module 'multer' {
    import { Request } from 'express';
  
    interface File extends Express.Multer.File {}
  
    interface Multer {
      (options?: any): any;
      single(fieldname: string): (req: Request, res: any, callback: (error: any) => void) => void;
    }
  
    const multer: Multer;
    export = multer;
  }
  