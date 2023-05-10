export interface IUser {

    id?: string | null | undefined;
    email?: string | null | undefined;
    name?: string | null | undefined;
    image?: string | null | undefined;
    token?: string | null | undefined;
   
}

export interface IContext extends IUser{
    loading: boolean;
    signin: (email: string, password: string) => Promise<boolean>;
    singout: () => void;
}

export interface IAuthProvider {
    children: React.ReactNode
}