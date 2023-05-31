import styles from "@/styles/Certidao-honorarios-oab-imprimir.module.css";
import { useRouter } from "next/router";


export default function CertidaoOAB() {

  const router = useRouter();

  const cert = router.query;

  return (

    <main>
      
     
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
          <p>  <strong>Autor:</strong> ({cert?.autor === 'true' ? 'X' : ' '}) <strong>Réu:</strong> ({cert?.reu === 'true' ? 'X' : ' '})</p>
          <p><strong>Registro Geral de Indicação:</strong> {cert?.indicacao}</p>

        </div>
        <div className="sentenca">
          <p><strong>Data da sentença:</strong> {cert?.sentencadata ? cert?.sentencadata : '* (Formato DD/MM/AAAA)'}</p>
          <p>({(cert?.sentencacod == '1') ? 'X' : ' '}) 1- Procedente</p>
          <p>({(cert?.sentencacod == '2') ? 'X' : ' '}) 2- Parcialmente Procedente</p>
          <p>({(cert?.sentencacod == '3') ? 'X' : ' '}) 3- Improcedente</p>
          <p>({(cert?.sentencacod == '6') ? 'X' : ' '}) 6- Acordo com 1 (um) advogado para todas as partes (Inserido pelo 4º aditamento, datado de 20/04/2016)</p>
          <p>({(cert?.sentencacod == '7') ? 'X' : ' '}) 7 – Acordo com 2 (dois) ou mais advogados (Inserido pelo 4º aditamento, datado de 20/04/2016)</p>
          <p>({(cert?.sentencacod == '5') ? 'X' : ' '}) 5- Outros: {
            (cert?.sentencacod == '5') ?
             cert?.sentencacomplemento :
             '*	(Se outros, informar, marcar e descrever a decisão ou o motivo que ensejou a expedição da certidão e o dispositivo legal correspondente.)'
             }</p>
        </div>
        <div className="transito">
          <p><strong>Data do trânsito em julgado:</strong> {cert?.data_transito ? cert.data_transito : '* (Formato DD/MM/AAAA)'}</p>
        </div>
        <div className="atos">
          <p><strong>Atos praticados:</strong></p>
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