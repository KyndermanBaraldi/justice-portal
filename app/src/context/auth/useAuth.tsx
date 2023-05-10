import { AuthContext } from "@/context/auth/AuthProvider";
import { useContext } from "react"

export const useAuth = () => {
    const context = useContext(AuthContext);

    return context;
}