import styles from "@/styles/Certidao-honorarios-oab.module.css";
import { useFormContext } from "react-hook-form";

const DadosAtos = () => {
  const { register } = useFormContext();

  return (
    <section>
      <h2>Atos Praticados</h2>
      <div className={styles.formAtos}>
        <input type="checkbox" id="todos_atos" value="1" {...register("atos_praticados")} />
        <label htmlFor="todos_atos">Todos os atos do processo</label>
      </div>
      <div className={styles.formAtos}>
        <input type="checkbox" id="at_atuacao_parcial" value="2" {...register("atos_praticados")} />
        <label htmlFor="at_atuacao_parcial">Atuação parcial</label>
      </div>
      <div className={styles.formAtos}>
        <input type="checkbox" id="at_recurso" value="4" {...register("atos_praticados")} />
        <label htmlFor="at_recurso">Recurso</label>
      </div>
      <div className={styles.formAtos}>
        <input type="checkbox" id="at_2_juri" value="10" {...register("atos_praticados")} />
        <label htmlFor="at_2_juri">2º Júri</label>
      </div>
      <div className={styles.formAtos}>
        <input type="checkbox" id="at_producao_provas" value="16" {...register("atos_praticados")} />
        <label htmlFor="at_producao_provas">Produção Antecipada de Provas – Art. 366, CPP</label>
      </div>
    </section>
  );
};

export default DadosAtos;
