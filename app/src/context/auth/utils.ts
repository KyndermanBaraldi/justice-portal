import { APP_ROUTES } from "@/routes/app-routes";
import { IUser } from "./types";

export const setUserLocalStorage = (user: IUser | null) => {
    
    localStorage.setItem("user", JSON.stringify(user));
    

}

export const getUserLocalStorage = () => {

    const json = localStorage.getItem("user");
    const user = !json ? null : JSON.parse(json)
    return user ?? null

}

export const checkIsPublicRoute = (route: string) => {
    return Object.values(APP_ROUTES.public).some((publicRoute) => publicRoute === route);
}