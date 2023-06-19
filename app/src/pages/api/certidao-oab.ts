import multer from 'multer';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import FormData from 'form-data';

import {Blob} from 'node:buffer';

export const config = {
  api: {
    bodyParser: false,
  },
};

type FileData = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

interface MulterRequest extends NextApiRequest {
  file: FileData;
}

const upload = multer().single('pdf_file');

export default async function handler(req: MulterRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
      
    upload(req, res, async (err: any) => {

      if (err) {
        
        res.status(500).json({ error: 'Erro ao processar a consulta' });
        return;
      }
      
      

        if (!req.file) {
          res.status(400).json({ error: 'Arquivo PDF não encontrado' });
          return;
        }

        const pdffile = new Blob([req.file.buffer], { type: req.file.mimetype });
        console.log(pdffile);

        const formData  = new FormData();
        formData.append('pdf_file', pdffile, req.file.originalname);

  
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}certidao-oab`, formData, {
          headers: formData.getHeaders(),
        });
        
        console.log(response);

        if (!response) {
          res.status(500).json({ error: 'Erro ao processar a consulta' });
          return;
        } 

        res.status(200).json(response);

      

    });

  } else {
    res.status(405).end(); // Método HTTP não permitido
  }
  
}
