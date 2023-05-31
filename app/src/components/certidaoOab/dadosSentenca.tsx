import { useFormContext } from "react-hook-form";
import styles from "@/styles/Certidao-honorarios-oab.module.css";

const DadosSentenca = () => {
  const { register, setValue, setFocus  } = useFormContext();

  const handleComplementoClick = () => {
    setValue("sentencacod", "5");
  };

  const handleCodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue("sentencacod", value);

    if (value !== "5") {
      setValue("sentencacomplemento", "");
    }

    if (value === "5") {
      setFocus("sentencacomplemento");  
    }

  };

  return (
    <section>
      <h2>
        Dados da Sentença
      </h2>
      <div className={styles.formControl}>
        <label htmlFor="sentencadata">Data da Sentença:</label>
        <input type="text" id="sentencadata" {...register("sentencadata")} />
      </div>
      <div className={styles.formControl}>
        <label>Código:</label>
        <div className={styles.formControl}>
          <label>
            <input
              type="radio"
              value="1"
              {...register("sentencacod")}
              onChange={handleCodChange}
            />
            Procedente
          </label>
          <label>
            <input
              type="radio"
              value="2"
              {...register("sentencacod")}
              onChange={handleCodChange}
            />
            Parcialmente Procedente
          </label>
          <label>
            <input
              type="radio"
              value="3"
              {...register("sentencacod")}
              onChange={handleCodChange}
            />
            Improcedente
          </label>
          <label>
            <input
              type="radio"
              value="6"
              {...register("sentencacod")}
              onChange={handleCodChange}
            />
            Acordo com 1 (um) advogado para todas as partes
          </label>
          <label>
            <input
              type="radio"
              value="7"
              {...register("sentencacod")}
              onChange={handleCodChange}
            />
            Acordo com 2 (dois) ou mais advogados
          </label>
          <label>
            <input
              type="radio"
              value="5"
              {...register("sentencacod")}
              onChange={handleCodChange}
            />
            Outros:
            <p className={styles.sentencacomplemento}>
              <input 
                type="text"
                id="sentencacomplemento"
                {...register("sentencacomplemento")}
                onClick={handleComplementoClick}
              />
            </p>
            <p>
            (Se outros, informar, marcar e descrever a decisão ou o motivo que ensejou a expedição da certidão e o dispositivo legal correspondente.)
            </p>
          </label>
          
        </div>
      </div>
      
      <div className={styles.formControl}>
        <label htmlFor="data_transito">Data do Trânsito em Julgado:</label>
        <input type="text" id="data_transito" {...register("data_transito")} />
      </div>
    </section>
  );
};

export default DadosSentenca;
