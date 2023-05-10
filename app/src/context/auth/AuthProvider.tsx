import {createContext, useEffect, useState, useCallback} from "react";
import { IContext, IUser, IAuthProvider } from "./types";
import { getUserLocalStorage, setUserLocalStorage } from "./utils";
import { firebaseSignIn, firebaseSignOut } from "@/services/firebase";
import { APP_ROUTES } from "@/routes/app-routes";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<IContext>({} as IContext)

export function AuthProvider({ children }: IAuthProvider) {
    const [user, setUser] = useState<IUser | null>()
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter();
  
    useEffect(() => {

        const user = getUserLocalStorage();
        if(user) {
            setUser(user);
        }

    }, []);

    const signin = useCallback(async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await firebaseSignIn(email, password);
            if (!response) {
                return false;
            } else {
                const payload : IUser = {
                    id: response.uid,
                    email: response.email,
                    name: response.displayName,
                    image: response.photoURL,
                    token: response.refreshToken,
                };
                setUser(payload);
                setUserLocalStorage(payload);
                router.push(APP_ROUTES.private.dashboard);
                return true;
            }
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setLoading(false);
        }
    }, [router] );


    const singout = useCallback(() => {

        try {
            setLoading(true);
            router.push('/login');
            return firebaseSignOut().then(() => {
                setUser(null);
                setUserLocalStorage(null);
                
            });
        } finally {
            setLoading(false);
        }
        
    }, [router] );

    return (
        
        <AuthContext.Provider value={{...user, loading, signin, singout}}>
            {children}
        </AuthContext.Provider>
    )
}

