import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { usePathname } from "next/navigation";
import { checkIsPublicRoute } from '@/routes/app-routes';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import Head from 'next/head';
import PrivateRoutes from '@/components/privateRoutes/privateRoutes';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
} : AppProps & { session: Session }) {
  
  const pathname = usePathname();
  const isPublicRoute = checkIsPublicRoute(pathname);

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Portal da Justiça</title>
        <meta name="description" content="Home page Portal da justiça - feito para super escreventes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      {isPublicRoute && <Component {...pageProps} />}
      {!isPublicRoute && <PrivateRoutes><Component {...pageProps} /> </PrivateRoutes>}

      <Footer />
    </SessionProvider>
  )
}