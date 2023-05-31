import { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler  } from 'react-hook-form';
import { v4 } from 'uuid';
import Image from 'next/image';

type Component = {
  id: string;
  nome: string;
  citado: string;
  detalheCitacao: string;
  manifestou: string;
  detalheManifestacao: string;
};

type FormData = {
  components: Component[];
};

export default function CertificarCiclo() {
  

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'components',
  });

  const [citados, setCitadosSim] = useState<Component[]>([]);
  const [citadosNao, setCitadosNao] = useState<Component[]>([]);
  const [manifestaram, setManifestaram] = useState<Component[]>([]);

  useEffect(() => {
    // Filtrar os componentes com base no valor de citado
    
  }, [fields]);


  

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const sim = fields.filter((field) => field.citado === 'sim');
    const nao = fields.filter((field) => field.citado === 'nao');
    const manifestaram = fields.filter((field) => field.manifestou === 'sim');

    setCitadosSim(sim);
    setCitadosNao(nao);
    setManifestaram(manifestaram);
  };

  return (

    <div>
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
      <div key={field.id}>
        <h3>Parte {index + 1}</h3>
        <button type="button" onClick={() => remove(index)}>
          Remover
        </button>
        <div>
          <label>
            Nome:
            <input
              type="text"
              {...register(`components.${index}.nome`)}
            />
          </label>
          <div>
          <span>Citado:</span>
          <label>
            <input
              type="radio"
              value="sim"
              {...register(`components.${index}.citado`)}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              value="nao"
              {...register(`components.${index}.citado`)}
            />
            Não
          </label>
          <label>
            Detalhe da Citação:
            <input
              type="text"
              {...register(`components.${index}.detalheCitacao`)}
            />
          </label>
        </div>
        <div>
          <span>Manifestou:</span>
          <label>
            <input
              type="radio"
              value="sim"
              {...register(`components.${index}.manifestou`)}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              value="nao"
              {...register(`components.${index}.manifestou`)}
            />
            Não
          </label>
          <label>
            Detalhe da Manifestação:
            <input
              type="text"
              {...register(`components.${index}.detalheManifestacao`)}
            />
          </label>
        </div>
        </div>
      </div>
))}

      <button type="button" onClick={() => append({id: v4(), nome: '', citado: '', detalheCitacao: '', manifestou: '', detalheManifestacao: '' })}>
        Adicionar Parte
      </button>

      <button type="submit">Enviar</button>
    </form>

    <section>

      <table>
        <tr>
          <td>
          <Image style={{background: 'black'}} src="/tjsp.png" alt="Logo TJSP" width={150} height={60}/>
          </td>
          <td>  
            <p>TRIBUNAL DE JUSTIÇA DO ESTADO DE SÃO PAULO</p>
            <p>COMARCA de Tremembé</p>
            <p>Foro de Tremembé</p>
            <p>2ª Vara</p>
            <p>
              Rua Costa Cabral, 1183, ., Centro - CEP 12120-013,
              Fone: (12) 2125-7365, Tremembe-SP - E-mail: tremembe2@tjsp.jus.br
              Horário de Atendimento ao Público: das 13h00min às 17h00min
            </p>
          </td>
        </tr>
      </table>

      <h2>Certidão</h2>

      <table>
        <tr>
          <td>Processo nº:</td>
          <td>1000000-00.0000.0.00.0000</td>
        </tr>
        <tr>
          <td>Classe - Assunto:</td>
          <td>Civel - Contratos</td>
        </tr>
        <tr>
          <td>Requerente:</td>
          <td>Fulano de Tal</td>
        </tr>
      </table>

      
      <p>Certifico e dou fé que o ciclo citatório {(citadosNao.length != 0) && <strong>NÃO</strong>} foi concluído,
      {(citadosNao.length == 0) && <span> havendo decorrido o prazo para apresentação de contestação,</span>} conforme abaixo.</p>
      <p><strong>Foram citados:</strong></p>
      {citados.map((component) => (
        <div key={component.id}>
           <p>{`${component.nome} - ${component.detalheCitacao}`}</p>
        </div>
      ))}

<p><strong>Não citados:</strong></p>
      {citadosNao.map((component) => (
        <div key={component.id}>
          <p>{component.nome}</p>
        </div>
      ))}

<p><strong>Manifestações:</strong></p>
      {manifestaram.map((component) => (
        <div key={component.id}>
          <p>{`${component.nome} - ${component.detalheManifestacao}`}</p>
        </div>
      ))}
      <p><strong>Decurso do prazo para contestação:</strong> {/* data */} </p>
       
    </section>


    </div>
  );
};