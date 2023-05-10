import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function PrivateRoutes({ children }: {children: React.ReactNode}) {

    const { data: session, status } = useSession()
    const isUser = !!session?.user
    
    useEffect(() => {
      if (status === "loading") return
      if (!isUser) signIn()
    }, [isUser, status])
  
    if (isUser) {
      return <>{children}</>
    }
  
    return <div>Loading...</div>
  }