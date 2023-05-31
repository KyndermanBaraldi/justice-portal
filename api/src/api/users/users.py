from fastapi import HTTPException
from pydantic import BaseModel

from Services.firebase import FirebaseClient


class IUser(BaseModel):
    nome: str
    email: str
    password: str
    cargo: str
    comarca: str
    vara: str
    forum: str


class Users:
    def __init__(self):
        self.firebase_client = FirebaseClient()

    def create_user(self, user: IUser):
        user_data = user.dict()

        child_cartorio = "cartorios/{}/{}/{}".format(
            user_data["comarca"], user_data["forum"], user_data["vara"]
        )

        cartorio = self.firebase_client.get_data(child_cartorio)
        if cartorio is None:
            raise HTTPException(status_code=400, detail="Cartório não encontrado.")

        user = self.firebase_client.create_user(
            email=user_data["email"],
            password=user_data["password"],
            name=user_data["nome"],
        )

        # Salvando os dados adicionais no Firestore
        child_user = "users/" + user

        self.firebase_client.save_data(
            child_user,
            {
                "nome": user_data["nome"],
                "email": user_data["email"],
                "cargo": user_data["cargo"],
                "comarca": user_data["comarca"],
                "vara": user_data["vara"],
                "forum": user_data["forum"],
            },
        )

        self.firebase_client.enviar_email_redefinicao_senha(user_data["email"])

        return user

    def get_current_user(self, token: str):
        user = self.firebase_client.get_current_user(token)

        child_path = "users/" + user

        return self.firebase_client.get_data(child_path)

    def get_cartorio(self, token: str):
        user = self.get_current_user(token)

        child_path = "cartorios/{}/{}/{}".format(
            user["comarca"], user["forum"], user["vara"]
        )

        cartorio = self.firebase_client.get_data(child_path)
        cartorio["comarca"] = user["comarca"]
        cartorio["foro"] = user["forum"]
        cartorio["vara"] = user["vara"]

        return cartorio
