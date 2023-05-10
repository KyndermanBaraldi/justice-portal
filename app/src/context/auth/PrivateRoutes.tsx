import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { APP_ROUTES } from "@/routes/app-routes";
import { getUserLocalStorage } from "./utils";

export const PrivateRoutes = ({ children }: {children: React.ReactNode}) => {

    const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
    const router = useRouter();
    
    useEffect(() => {
        const isUserAuthenticated = !!getUserLocalStorage();
        setIsUserAuthenticated(isUserAuthenticated);
        if (!isUserAuthenticated) {
            router.push(APP_ROUTES.public.login);
        }
    }, [router]);

    return (
    <>
        {!isUserAuthenticated && null}
        {isUserAuthenticated && children}
    </>
    );
};