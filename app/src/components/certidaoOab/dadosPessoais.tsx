import { useFormContext } from "react-hook-form";
import styles from "@/styles/Certidao-honorarios-oab.module.css";

const DadosPessoais = () => {
  const { register } = useFormContext();
  
  return (
    <section>
      <h2>Dados do Advogado e dos Beneficiários</h2>
      <div className={styles.formControl} >
        <label htmlFor="advogado">Advogado:</label>
        <input type="text" id="advogado" {...register("advogado")} />
      </div>
      <div className={styles.formControl}>
        <label htmlFor="oab">OAB:</label>
        <input type="text" id="oab" {...register("oab")} />
      </div>
      <div className={styles.formControl}>
        <label htmlFor="data_indicacao">Data da Nomeação:</label>
        <input type="text" id="data_indicacao" {...register("data_indicacao")} />
      </div>
      <div className={styles.formControl}>
        <label htmlFor="indicacao">Registro de Indicação:</label>
        <input type="text" id="indicacao" {...register("indicacao")} />
      </div>
      <div className={styles.formControl}>
        <label htmlFor="beneficiarios">Beneficiário(a):</label>
        <input type="text" id="beneficiarios" {...register("beneficiarios")} />
      </div>
      <div className={styles.formAutor}>
        <label>Autor: 
          <input type="radio" value="true"  {...register("autor")} />
        </label>
        <label>Réu: 
          <input type="radio" value="false" {...register("autor")}/>
        </label>
      </div>
      
    </section>
  );
};

export default DadosPessoais;
