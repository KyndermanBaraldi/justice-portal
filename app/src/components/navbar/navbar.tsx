import Link from 'next/link';
import styles from './navbar.module.css';
import Menu from '@/components/menu/menu';
import { APP_ROUTES } from '@/routes/app-routes';
import { signOut } from "next-auth/react"
import { useSession } from 'next-auth/react';

const menuItems = [
    {
      title: 'Inicio',
      path: APP_ROUTES.public.home,
    },
    {
      title: 'Certificador',
      dropdown: [
        {
          title: 'Certificar prazo',
          path: APP_ROUTES.private.servicos.certificar_prazo,
        },
        {
          title: 'Certidão de Honorários OAB',
          path: APP_ROUTES.private.servicos.certitidao_honorarios_oab,
        },
      ],
    },
    {
      title: 'Sobre',
      path: APP_ROUTES.public.sobre,
    },
  ];

const Navbar: React.FC = () => {
    const { data } = useSession()
    return (
        <nav className={styles.menu}>
            <div className={styles.logo}>
                Portal da Justiça
            </div>
            {data && (<Menu menuItems={menuItems}/>)}
            <div className={styles.login}>

                {!data && ( <Link className={styles.nav_links}  href={APP_ROUTES.public.login}>Login</Link> )}
                {data && ( <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>Sign out</button> )}

            </div>
        </nav>
    );
};

export default Navbar;
