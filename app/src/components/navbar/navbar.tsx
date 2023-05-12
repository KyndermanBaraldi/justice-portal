import Link from 'next/link';
import styles from './navbar.module.css';
import Menu from '@/components/menu/menu';
import { APP_ROUTES, menuItems } from '@/routes/app-routes';
import { signOut } from "next-auth/react"
import { useSession } from 'next-auth/react';



const Navbar: React.FC = () => {
    const { data } = useSession()
    return (
        <nav className={styles.menu}>
            <div className={styles.logo}>
                Portal da Justiça
            </div>
            {!!data && (<Menu menuItems={menuItems}/>)}
            <div className={styles.login}>

                {!data && ( <Link className={styles.nav_links}  href={APP_ROUTES.public.login}>Login</Link> )}
                {data && ( <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>Sign out</button> )}

            </div>
        </nav>
    );
};

export default Navbar;
