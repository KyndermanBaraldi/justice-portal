import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react";
import axios from 'axios';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const session = await getSession({req});
        
    if (!session) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
    }
      
    try {

      const token = session.user?.token;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}usuario/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status !== 200) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      res.status(200).json({ data: response.data });

    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

