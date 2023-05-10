import styles from "@/styles/Certidao-honorarios-oab.module.css";

import { useRef, useState } from "react";
import { z } from "zod";

const certidaoSchema = z.object({
  processo: z.string(),
  vara: z.string(),
  juizo: z.string(),
  assunto: z.string(),
  codigo: z.string(),
  data_indicacao: z.string(),
  beneficiarios: z.string(),
  autor: z.boolean(),
  reu: z.boolean(),
  advogado: z.string(),
  oab: z.string(),
  indicacao: z.string(),
  sentenca: z.object({cod: z.string(), data: z.string(), complemento: z.string()}).optional(),
  data_transito: z.string().optional(),
  atos_praticados: z.array(z.string()).optional(),
});

type Certidao = z.infer<typeof certidaoSchema>;


export default function CertidaoOAB() {

  const [inputfile, setinputfile] = useState<Blob | null>(null);
  const inputfileRef = useRef<HTMLInputElement | null>(null)
  const [cert, setCert] = useState<Certidao>();

  const handleUploadFile = (e: any) => setinputfile(e.target.files[0]);

  const getData = async () => {

    if (!inputfile) {
      return
    }

    const formData  = new FormData();
    formData.append('pdf_file', inputfile);

    const options = {
      method: 'POST',
      body: formData
    };

    const response = await fetch('http://localhost:5001/certidao-oab', options)
    const data = await response.json()
    setCert(data)
    if (inputfileRef.current) {
      inputfileRef.current.value = '';
      setinputfile(null)
    }

  }

  return (

    <main>
      
      <section className={styles.fileForm}>
        <label className="form-label">Carregar ofício de indicação:</label>
        <input type="file" onChange={handleUploadFile} accept="application/pdf" ref={inputfileRef}/>
        <button onClick={getData} disabled={!inputfile}>Obter dados</button>
      </section>


      <section className={styles.certidao}>
      
        <h1 className={styles.header} >CERTIDÃO PARA FINS DO CONVÊNIO DEFENSORIA/OAB</h1>
        
        <div className="processo">
          <p><strong>Juízo de Direito da {cert?.juizo ? cert.juizo : '2ª Vara  do Foro de Tremembé da Comarca de Tremembé'}</strong></p>
          <p><strong>Código da Vara:</strong> {cert?.vara ? cert.vara : '1458'}</p>
          <p><strong>Ação:</strong> {cert?.assunto}</p>
          <p><strong>Código de Ação:</strong> {cert?.codigo}</p>
          <p><strong>Processo:</strong> {cert?.processo}</p>
          <p><strong>Classe-Assunto:</strong> {cert?.assunto}</p>
          <p><strong>Advogado:</strong> {cert?.advogado}</p>
          <p><strong>OAB:</strong> {cert?.oab} <strong>Data da nomeação:</strong> {cert?.data_indicacao}</p>
          <p><strong>Beneficiário(a):</strong> {cert?.beneficiarios}</p>
          <p>  <strong>Autor:</strong> ({cert?.autor ? 'X' : ' '}) <strong>Réu:</strong> ({cert?.reu ? 'X' : ' '})</p>
          <p><strong>Registro Geral de Indicação:</strong> {cert?.indicacao}</p>

        </div>
        <div className="sentenca">
          <p><strong>Data da sentença:</strong> {cert?.sentenca ? cert?.sentenca.data : '* (Formato DD/MM/AAAA)'}</p>
          <p>({(cert?.sentenca?.cod == '1') ? 'X' : ' '}) 1- Procedente</p>
          <p>({(cert?.sentenca?.cod == '2') ? 'X' : ' '}) 2- Parcialmente Procedente</p>
          <p>({(cert?.sentenca?.cod == '3') ? 'X' : ' '}) 3- Improcedente</p>
          <p>({(cert?.sentenca?.cod == '6') ? 'X' : ' '}) 6- Acordo com 1 (um) advogado para todas as partes (Inserido pelo 4º aditamento, datado de 20/04/2016)</p>
          <p>({(cert?.sentenca?.cod == '7') ? 'X' : ' '}) 7 – Acordo com 2 (dois) ou mais advogados (Inserido pelo 4º aditamento, datado de 20/04/2016)</p>
          <p>({(cert?.sentenca?.cod == '5') ? 'X' : ' '}) 5- Outros: {
            (cert?.sentenca?.cod == '5') ?
             cert?.sentenca?.complemento :
             '*	(Se outros, informar, marcar e descrever a decisão ou o motivo que ensejou a expedição da certidão e o dispositivo legal correspondente.)'
             }</p>
        </div>
        <div className="transito">
          <p><strong>Data do trânsito em julgado:</strong> {cert?.data_transito ? cert.data_transito : '* (Formato DD/MM/AAAA)'}</p>
        </div>
        <div className="atos">
          <p><strong>Atos praticados::</strong></p>
          <p>({(cert?.atos_praticados?.includes('1')) ? 'X' : ' '}) 1-  Todos os atos do processo</p>
          <p>({(cert?.atos_praticados?.includes('2')) ? 'X' : ' '}) 2-  Atuação parcial</p>
          <p>({(cert?.atos_praticados?.includes('4')) ? 'X' : ' '}) 4-  Recurso</p>
          <p>({(cert?.atos_praticados?.includes('10')) ? 'X' : ' '}) 10 - 2º Júri</p>
          <p>({(cert?.atos_praticados?.includes('12')) ? 'X' : ' '}) 16 - Produção Antecipada de Provas – Art. 366, CPP.</p>
        </div>

      </section>
    </main>
    
  )

}