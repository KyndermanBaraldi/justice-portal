import { APP_ROUTES } from "@/routes/app-routes";
import { firebaseSignIn } from "@/services/firebase";
import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
      CredentialProvider({
        name: "credentials",
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "Email: exemplo@exemplo.com",
          },
          password: { label: "Senha", type: "password" },
        },
        authorize: async (credentials) => {
          try {
            let user = null;
            if (credentials) {
                user = await firebaseSignIn(credentials.email, credentials.password);
            }
  
            if (user) {
               return {
                    id: user.uid,
                    email: user.email,
                    name: user.displayName,
                    image: user.photoURL,
                    token: user.refreshToken,
               };
            } else {
              return null;
            }
          } catch (error: any) {
            throw new Error('Não foi possível realizar o login. Verifique suas credenciais.');
          }
        },
      }),
    ],
    callbacks: {
      jwt: async ({ token, user }) => {
        if (user) {
          token.id = user.id;
        }
  
        return token;
      },
      session: async ({ session, token }) => {
        if (token && session?.user) {

            session = {
                ...session,
                user: {
                    id: token.id,
                    ...session.user
                }
            }
          
        }
        return session;
      },
    },
    secret: "jwttoken",
    pages: {
      signIn: APP_ROUTES.public.login, 
      error: APP_ROUTES.public.login, 
    },
    jwt: {
      secret: "jwttoken",
    },
  });