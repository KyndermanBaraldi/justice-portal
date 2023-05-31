import Link from 'next/link';
import styles from './header.module.css';
import Menu from '@/components/menu/menu';
import { APP_ROUTES, menuItems } from '@/routes/app-routes';
import { signOut } from "next-auth/react"
import { useSession } from 'next-auth/react';


const Header: React.FC = () => {
    const { data } = useSession()
    return (
        <nav className={styles.menu}>
            <div className={styles.logo}>
              <Link className={styles.nav_links}  href={APP_ROUTES.public.home}>Liga da Justiça</Link>
            </div>
            {!!data && (<Menu menuItems={menuItems}/>)}
            <div className={styles.containerlogin}>

                {!data && (
                  <>
                    <Link className={styles.cadastrar}  href={APP_ROUTES.public.cadastro}>Cadastrar</Link>
                    <Link className={styles.nav_links}  href={APP_ROUTES.public.login}>Login</Link>
                  </>
                )}
                {data && (
                  <>
                    <span>Olá, {data.user.name}</span>
                    <button className={styles.logout} onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>Sign out</button>
                  </>
                )}

            </div>
        </nav>
    );
};

export default Header;
