import styles from "@/styles/Login.module.css";
import 'react-toastify/dist/ReactToastify.min.css';

import { toast, ToastContainer} from 'react-toastify';
import LoginCard from "@/components/logincard/logincard";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

import { APP_ROUTES } from "@/routes/app-routes";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
});

type FormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { 
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();  
  const onSubmit = async (values: FormValues) => {
        
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: `${window.location.origin}`,
      }); 
    
      if (res?.error) {
        toast.error(`${res.error}`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      
      if (res?.url) router.push(res.url);

  };

  return (
    <div className={styles.background}>
           
      <LoginCard title="Entre em sua Conta">

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          
          <input 
            {...register('email')}
            className={styles.input}
            type="email"
            placeholder="E-mail..."
            // error={!!errors.email?.message}
            // helperText={errors.email?.message}            
          />
          <input {...register('password')} className={styles.input} type="password" placeholder="Senha..." />
          <button className={styles.button}>Entrar</button>
          <p>Ainda não possui conta? <Link href={APP_ROUTES.public.cadastro}>Cadastre-se aqui</Link> </p>

        </form>
      </LoginCard>
      <ToastContainer />
    </div>
  )
}
