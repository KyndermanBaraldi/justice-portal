import { z } from "zod";

export const certidaoSchema = z.object({
  processo: z.string(),
  assunto: z.string(),
  codigo: z.string(),
  data_indicacao: z.string(),
  beneficiarios: z.string(),
  autor: z.string(),
  reu: z.string(),
  advogado: z.string(),
  oab: z.string(),
  indicacao: z.string(),
  sentencacod: z.string().optional(),
  sentencadata: z.string().optional(),
  sentencacomplemento: z.string().optional(),
  data_transito: z.string().optional(),
  atos_praticados: z.array(z.string()).optional(),
});

export type Certidao = z.infer<typeof certidaoSchema>;
