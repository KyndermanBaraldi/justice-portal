import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import internal from "stream";

type FormData = {
  inicio: string,
  prazo: internal
  fls: string,
}

type Prazo = {
  start_date: string,
  working_days: number,
  end_date: string,
  non_working_days: Array<string>,
}

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

export default function CertificarTransito() {
  
  const { data } = useSession()
  const { user } = data || { user: null }
  const [prazo, setPrazo] = useState<Prazo | null>(null)
  const { register, handleSubmit, getValues } = useForm<FormData>()
  const date = new Date();
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = meses[date.getMonth()];
  const ano = date.getFullYear();

  const onSubmit = async (values: FormData) => {
    // console.log(values)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}prazo?inicio=${values.inicio}&dias=${values.prazo}`)
    const data = await response.json()
    setPrazo(data)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="inicio">Data Inicial:</label>
          <input type="text" id="inicio" {...register('inicio')} />
        </div>
        <div>
          <label htmlFor="prazo">Prazo:</label>
          <input type="number" id="prazo" {...register('prazo')} />
        </div>
        <div>
          <label htmlFor="fls">Fls:</label>
          <input type="text" id="fls" {...register('fls')} />
        </div>

        <button type="submit">Enviar</button>
      </form>
      <section>

        <h1>Certidão de Trânsito em Julgado</h1>
        <p>
          { `Certifico e dou fé que a r. sentença de fls. ${getValues('fls')} transitou em julgado
             em ${prazo?.end_date}. Certifico ainda que o processo foi baixado definitivamente no
             sistema. Nada Mais. Tremembe, ${dia} de ${mes} de ${ano}. Eu, ___,
             ${user?.name}, Escrevente Técnico Judiciário.` }
        </p>
      </section>
    </div>
  )

}