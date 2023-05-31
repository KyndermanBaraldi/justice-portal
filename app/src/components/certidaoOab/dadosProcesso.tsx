import { useEffect, useState } from 'react';
import { useFormContext } from "react-hook-form";
import styles from "@/styles/Certidao-honorarios-oab.module.css";

const DadosProcesso = () => {
  const { register } = useFormContext();
  const [codigo_oab, setCodigo] = useState<Object | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/codigoOAB');
        const json = await response.json();
        setCodigo(json.data);
      } catch (error) {
        console.error('Erro ao consultar a API:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <section>
      <h2>Dados do Processo</h2>
      <div className={styles.formControl}>
        <label htmlFor="processo">Processo:</label>
        <input type="text" id="processo" {...register("processo")} />
      </div>
      <div className={styles.formControl}>
        <label htmlFor="assunto">Assunto:</label>
        <input type="text" id="assunto" {...register("assunto")} />
      </div>
      <div className={styles.formControl}>
        <label htmlFor="codigo">Código da ação:</label>
        {codigo_oab && 
           (
              <select id="codigo" {...register("codigo")}>
                { Object.entries(codigo_oab).map(([codigo, dados]) => (
                    <option key={codigo} value={codigo}>
                      {codigo} - {dados['Natureza da Ação']} - {dados['Tipo']}
                    </option>
                ))}
              </select>
          )}
         
      </div>
    </section>
  );
};

export default DadosProcesso;
