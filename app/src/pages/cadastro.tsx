
import styles from "@/styles/Login.module.css";
import 'react-toastify/dist/ReactToastify.min.css';

import LoginCard from "@/components/logincard/logincard";
import { toast, ToastContainer} from 'react-toastify';
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { APP_ROUTES } from "@/routes/app-routes";
import { firebaseRegister } from "@/services/firebase";
import { useRouter } from "next/router";

const cadastroSchema = z.object({
  nome: z.string().min(3, 'O nome deve conter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
});

type FormValues = z.infer<typeof cadastroSchema>;

export default function Cadastro() {
  

  const { 
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(cadastroSchema),
  });
  
  const router = useRouter();
  
  const onSubmit = async (values: FormValues) => {

    try {
      await firebaseRegister(      
        values.nome, values.email, values.password,
      );
      
      router.push(APP_ROUTES.public.login);

    } catch (error) {
      
      toast.error(`${error}`, {
        position: toast.POSITION.TOP_CENTER,
      });

    };
  };

   


  return (
    <section className={styles.background}>
      <LoginCard title="Cadastre-se">

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          
          <input {...register('nome')} className={styles.input} type="text" placeholder="Nome..."/>
          <input {...register('email')} className={styles.input} type="email" placeholder="E-mail..."/>
          <input {...register('password')} className={styles.input} type="password" placeholder="Senha..."/>
          <button className={styles.button}>Cadastrar</button>
          <p>Já possui conta? <Link href={APP_ROUTES.public.login}>Entre aqui</Link> </p>

        </form>
      </LoginCard>
      <ToastContainer />
    </section>
  )
}
