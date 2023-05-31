import os
from dotenv import load_dotenv
from fastapi import HTTPException
import firebase_admin
from firebase_admin import credentials, auth
from firebase_admin import db


class FirebaseClient:
    def __init__(self):
        try:
            self.app = firebase_admin.get_app()

        except:
            load_dotenv()
            cred = credentials.Certificate(
                {
                    "type": os.getenv("TYPE"),
                    "project_id": os.getenv("PROJECT_ID"),
                    "private_key_id": os.getenv("PRIVATE_KEY_ID"),
                    "private_key": os.getenv("PRIVATE_KEY").replace("\\n", "\n"),
                    "client_email": os.getenv("CLIENT_EMAIL"),
                    "client_id": os.getenv("CLIENT_ID"),
                    "auth_uri": os.getenv("AUTH_URI"),
                    "token_uri": os.getenv("TOKEN_URI"),
                    "auth_provider_x509_cert_url": os.getenv("AUTH_PROVIDER"),
                    "client_x509_cert_url": os.getenv("CLIENT_URL"),
                    "universe_domain": os.getenv("UNIVERSE_DOMAIN"),
                }
            )

            self.app = firebase_admin.initialize_app(
                cred, {"databaseURL": os.getenv("DATABASE_URL")}
            )

    def create_user(self, email, password, name):
        try:
            user = auth.create_user(
                email=email,
                password=password,
                display_name=name,
            )

            return user.uid
        except firebase_admin.auth.EmailAlreadyExistsError:
            raise HTTPException(
                status_code=400, detail="O email já está sendo usado por outro usuário."
            )
        except firebase_admin.auth.InvalidEmailError:
            raise HTTPException(status_code=400, detail="O email fornecido é inválido.")
        except firebase_admin.auth.InvalidPasswordError:
            raise HTTPException(status_code=400, detail="A senha fornecida é inválida.")
        except Exception as e:
            raise HTTPException(
                status_code=500, detail="Erro ao criar usuário: " + str(e)
            )

    def get_current_user(self, token: str):
        try:
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token["uid"]
            return uid
        except auth.InvalidIdTokenError:
            raise HTTPException(
                status_code=401, detail="Token de autenticação inválido"
            )
        except auth.ExpiredIdTokenError:
            raise HTTPException(
                status_code=401, detail="Token de autenticação expirado"
            )

    def enviar_email_redefinicao_senha(self, email):
        try:
            # Solicite a redefinição de senha para o e-mail fornecido
            link = auth.generate_password_reset_link(email)
            print(link)

        except auth.AuthError as e:
            raise HTTPException(
                status_code=500,
                detail="Erro ao enviar o e-mail de redefinição de senha:" + str(e),
            )

    def save_data(self, child: str, data: dict):
        try:
            ref = db.reference(child)
            ref.set(data)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail="Erro ao salvar dados: " + str(e)
            )

    def get_data(self, child: str):
        try:
            ref = db.reference(child)
            return ref.get()
        except Exception as e:
            raise HTTPException(
                status_code=500, detail="Erro ao obter dados: " + str(e)
            )
