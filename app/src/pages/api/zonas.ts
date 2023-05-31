// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: Array<Zona>
}

type Zona = {
  codigo: string,
  bairro: string,
  zona: string,
  cidade: string,
}

const Zonas = [{codigo:"1", bairro: "CAMINHO NOVO- PREFEITURA MUCICIPAL", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"2", bairro: "CAMPOS DO CONDE I, II e III - CENTRO", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"3", bairro: "CHÁCARA CANAÃ - CHÁCARA DAS ROSAS", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"4", bairro: "CHÁCARA NOVA VIDA - ELDORADO", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"5", bairro: "FLOR DO VALE - HATAVILLE- B.GUEDES", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"6", bairro: "JARDIM BOM JESUS - JD. DOS EUCALIPTOS ", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"7", bairro: "JARDIM JARAGUÁ (NOVO)", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"8", bairro: "JARDIM PAINEIRAS - JARDIM SAMAR", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"9", bairro: "JARDIM SANTANA - JARDIM VILA NOVA", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"10", bairro: "PADRE ETERNO - PARQUE DAS FONTES", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"11", bairro: "PARQUE DOS PÁSSAROS", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"12", bairro: "PARQUE NOSSA SENHORA DA GLÓRIA", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"13", bairro: "PARQUE NOSSA SENHORA DA GUIA", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"14", bairro: "PARQUE NOVO MUNDO", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"15", bairro: "PARQUE VERA CRUZ-PQ. DAS ARAUCÁRIAS", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"16", bairro: "PORTAL DO SOL - RANCHO GRANDE", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"17", bairro: "RESID. SANTA LÚCIA - RESID. ANA CÂNDIDA", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"18", bairro: "RESID. VARGAS - RETIRO FELIZ", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"19", bairro: "SANTA ISABEL - SÃO VICENTE DE PAULA", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"20", bairro: "SOLAR DA MANTIQUEIRA ", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"21", bairro: "TERRAS DE BENVIRÁ - VALE DAS FLORES", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"22", bairro: "VALE DO SOL - VILA MIGOTO", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"23", bairro: "VILA SANTO ANTÔNIO", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"24", bairro: "VILLAGE TREMEMBÉ", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"25", bairro: "RESIDENCIAL ARAUCARIA", zona: "ZONA ÚNICA - COMPARTILHADA ", cidade: "Tremembé"},
{codigo:"26", bairro: "ATERRADO", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"27", bairro: "KANEGAE -RIO VERDE(assentamento 0lga)", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"28", bairro: "BERIZAL", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"29", bairro: "BAIRRO PARAÍSO", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"30", bairro: "MARISTELA", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"31", bairro: "MATO DENTRO", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"32", bairro: "ASSENTAMENTO CONQUISTA", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"33", bairro: "RECANTO SÃO LUÍS", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"34", bairro: "RODOVIA PEDRO CELETE", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"35", bairro: "ASSENTAMENTO OLGA BERNARIO", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"36", bairro: "OLARIA FUNIRÓ", zona: "ZONA RURAL I", cidade: "Tremembé"},
{codigo:"37", bairro: "ROD.FLORIANO RODRIGUES PINHEIRO", zona: "ZONA RURAL II", cidade: "Tremembé"},
{codigo:"38", bairro: "FLOR DO CAMPO", zona: "ZONA RURAL II", cidade: "Tremembé"},
{codigo:"39", bairro: "JARDIM ALBERTO RONCONI", zona: "ZONA RURAL II", cidade: "Tremembé"},
{codigo:"40", bairro: "JARDIM MARACAIBO", zona: "ZONA RURAL II", cidade: "Tremembé"},
{codigo:"41", bairro: "BAIRRO DOS NALDI", zona: "ZONA RURAL II", cidade: "Tremembé"},
{codigo:"42", bairro: "POÇO GRANDE", zona: "ZONA RURAL II", cidade: "Tremembé"},
{codigo:"43", bairro: "CHACARA SÃO LUIZ", zona: "ZONA RURAL II", cidade: "Tremembé"},
{codigo:"44", bairro: "FAZENDA REIPLAN", zona: "ZONA - PRESÍDIOS", cidade: "Tremembé"},
{codigo:"45", bairro: "PENIT. I MASCULINA (P-1)", zona: "ZONA - PRESÍDIOS", cidade: "Tremembé"},
{codigo:"46", bairro: "PENIT. I FEMININA (CENTRO)", zona: "ZONA - PRESÍDIOS", cidade: "Tremembé"},
{codigo:"47", bairro: "PENIT. II MASCULINA (IRT)", zona: "ZONA - PRESÍDIOS", cidade: "Tremembé"},
{codigo:"48", bairro: "PENIT. II FEMININA (UNA)", zona: "ZONA - PRESÍDIOS", cidade: "Tremembé"},
{codigo:"49", bairro: "PEMANO", zona: "ZONA - PRESÍDIOS", cidade: "Tremembé"},
{codigo:"50", bairro: "PRESÍDIOS DE OUTRAS COMARCAS", zona: " ZONA REMOTO", cidade: "Tremembé"},
{codigo:"51", bairro: "URGENTE PLANTÃO", zona: "ZONA PLANTÃO", cidade: "Tremembé"},
{codigo:"52", bairro: "PROCESSOS FÍSICOS", zona: "ZONA FÍSICOS", cidade: "Tremembé"}]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { bairro } = req.query;

  const resultado = bairro ? Zonas.filter(item => item.bairro.includes(String(bairro))) : Zonas;
  res.status(200).json({ data: resultado })
}
