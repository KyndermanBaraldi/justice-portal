
import styles from "@/styles/Login.module.css";
import 'react-toastify/dist/ReactToastify.min.css';

import LoginCard from "@/components/logincard/logincard";
import { toast, ToastContainer} from 'react-toastify';
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { APP_ROUTES } from "@/routes/app-routes";
import { useRouter } from "next/router";
import { v4 } from "uuid";
import Modal from "@/components/modal/modal";
import { useState } from "react";


const cadastroSchema = z.object({
  nome: z.string().min(3, 'O nome deve conter no mínimo 3 caracteres').nonempty('Campo obrigatório'),
  email: z.string().email('E-mail inválido').nonempty('Campo obrigatório'),
  cargo: z.string().nonempty('Campo obrigatório'),
  comarca: z.string().nonempty('Campo obrigatório'),
  vara: z.string().nonempty('Campo obrigatório'),
  forum: z.string().nonempty('Campo obrigatório'),
});


export default function Cadastro() {

  type FormValues = z.infer<typeof cadastroSchema>;

  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, setError, formState: { errors }, reset, getValues } = useForm<FormValues>({
    resolver: zodResolver(cadastroSchema),
  });
  
  const router = useRouter();
  
  const onSubmit = async (formData: FormValues) => {

    const isFormValid = Object.keys(formData).every((key) => {
      const value = formData[key as keyof FormValues];
      return value !== undefined && value !== null && String(value) !== '';
    });

    if (!isFormValid) {
      // Exibir mensagem de erro caso algum campo esteja vazio
      setError('nome', {
        type: 'manual',
        message: 'Por favor, preencha todos os campos',
      });
      return;
    }

    const data = { password: v4(), ...formData };
    
    try {
      const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}usuario/cadastrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {

        setIsOpen(true);

      } else {

        toast.error("Erro ao cadastrar usuário.", {
          position: toast.POSITION.TOP_CENTER,
        });
      
      }

    } catch (error) {
      
      toast.error(`${error}`, {
        position: toast.POSITION.TOP_CENTER,
      });

    };
  
    reset();

}; 

const handleOk = () => {
  setIsOpen(false);
  router.push(APP_ROUTES.public.home);
}
  return (
    <section className={styles.background}>
      <LoginCard title="Cadastre-se">

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          
        <input {...register('nome')} className={styles.input} type="text" placeholder="Nome..." />
      {errors.nome && <span>{errors.nome.message}</span>}

      <input {...register('email')} className={styles.input} type="email" placeholder="E-mail..." />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('cargo')} className={styles.input} type="text" placeholder="Cargo..." />
      {errors.cargo && <span>{errors.cargo.message}</span>}

      <input {...register('comarca')} className={styles.input} type="text" placeholder="Comarca..." />
      {errors.comarca && <span>{errors.comarca.message}</span>}

      <input {...register('forum')} className={styles.input} type="text" placeholder="Foro..." />
      {errors.forum && <span>{errors.forum.message}</span>}

      <input {...register('vara')} className={styles.input} type="text" placeholder="Vara..." />
      {errors.vara && <span>{errors.vara.message}</span>}
          
          <button className={styles.button} type="submit">Cadastrar</button>
          <p>Já possui conta? <Link href={APP_ROUTES.public.login}>Entre aqui</Link> </p>

        </form>
      </LoginCard>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Cadastro realizado com sucesso.">
        <h2>Obrigado por se cadastrar, {getValues('nome')}</h2>
        <p>Em breve você receberá um e-mail para criar sua senha</p>
        <button className={styles.button} type="button" onClick={handleOk}>Ir para Home</button>
      </Modal>

      <ToastContainer />
    </section>
  )
}
