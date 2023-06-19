import styles from "@/styles/Certidao-honorarios-oab.module.css";
import 'react-toastify/dist/ReactToastify.min.css';

import { toast, ToastContainer} from 'react-toastify';
import { Certidao } from "@/components/certidaoOab/CertidaoTypes";
import DadosAtos from "@/components/certidaoOab/dadosAtos";
import DadosPessoais from "@/components/certidaoOab/dadosPessoais";
import DadosProcesso from "@/components/certidaoOab/dadosProcesso";
import DadosSentenca from "@/components/certidaoOab/dadosSentenca";
import useSteps from "@/hooks/useSteps";
import { useForm, FormProvider } from "react-hook-form";
import {GrFormNext, GrFormPrevious, GrDocumentTransfer} from 'react-icons/gr'
import {FiSend} from 'react-icons/fi'
import { useRouter } from 'next/router';
import { APP_ROUTES } from "@/routes/app-routes";
import Modal from "@/components/modal/modal";
import { useRef, useState } from "react";
import Loading from "@/components/loading/Loading";

export default function CertidaoOAB() {
  
  const router = useRouter();
  const methods = useForm<Certidao>();
  const [inputfile, setinputfile] = useState<Blob | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isloading, setIsloading] = useState<boolean>(false);
  const inputfileRef = useRef<HTMLInputElement | null>(null)
 
  const formComponents = [
    <DadosProcesso key={1}/>,
    <DadosPessoais key={2}/>,
    <DadosSentenca key={3}/>,
    <DadosAtos key={4}/>,
  ];

  const { currentStep, index, nextStep, prevStep, isLast, isFirst } = useSteps(formComponents);
  
  const handleUploadFile = (e: any) => setinputfile(e.target.files[0]);

  const getData = async () => {

    if (!inputfile) {
      return
    }

    setIsOpen(false);
    setIsloading(true);

    try {

      const formData  = new FormData();
      formData.append('pdf_file', inputfile);
      
      const options = {
        method: 'POST',
        body: formData
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}certidao-oab`, options)
      
      const data = await response.json()
      
      console.log(data)
      methods.reset(data)
      
    } catch (error) {
      toast.error('Erro ao ler arquivo', {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      if (inputfileRef.current) {
        inputfileRef.current.value = '';
      }
      
      setinputfile(null)
      setIsloading(false);
    }

  }
 
  const onSubmit = (data: Certidao) => {
    if (isLast) {
      router.push({
        pathname: APP_ROUTES.private.servicos.certitidao_honorarios_oab.imprimir,
        query: data
      });
    }
    nextStep();
  };

  return (
    <FormProvider {...methods} >
      <main className={styles.app}>

        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Ofício de Indicação">
          <div className={styles.fileForm}>
            <label className="form-label">Carregar ofício de indicação:</label>
            <input type="file" onChange={handleUploadFile} accept="application/pdf" ref={inputfileRef}/>
            <button onClick={getData} disabled={!inputfile}>Obter dados</button>
          </div>
          
        </Modal>

        <div className={styles.header}>
          <h2>CERTIDÃO PARA FINS DO CONVÊNIO DEFENSORIA/OAB</h2>
        </div>
        <div className={styles.formContainer}>
          <button className={styles.open} onClick={()=>setIsOpen(true)}><GrDocumentTransfer/></button>
          

          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className={styles.inputContainer}>
              {currentStep}
            </div>
            <div className={styles.buttonsContainer}>
              {!isFirst && (<button type="button" onClick={prevStep}>
                <GrFormPrevious />
                <span>Voltar</span>
              </button>)}
              <button type="submit">
                { isLast ? 
                  (<>
                  <span>Enviar</span>
                  <FiSend/>
                  </>) :
                  (<>
                    <span>Avançar</span>
                    <GrFormNext />
                  </>
                  )
                }
              </button>
            </div>
            <p>
              etapa: {index + 1} de {formComponents.length}
            </p>

          </form>

        </div>

        {isloading && <Loading/>}
        <ToastContainer />
      </main>

    </FormProvider>
    
  )

}