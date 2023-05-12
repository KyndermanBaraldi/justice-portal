import json
import requests as request
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import os


def save_data_to_firebase_admin(child: str, data: dict):
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

    firebase_admin.initialize_app(cred, {"databaseURL": os.getenv("DATABASE_URL")})

    ref = db.reference(child)

    for items in data:
        for year, months in items.items():
            for item in months:
                for month, month_data in item.items():
                    ref.child(str(year)).child(str(month)).set(month_data)


def get_tax(year: str, month: str):
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

    firebase_admin.initialize_app(cred, {"databaseURL": os.getenv("DATABASE_URL")})

    ref = db.reference("indices")

    return ref.child(year).child(month).get()


def save_json_to_firebase_restapi(child: str, data: str):
    load_dotenv()  # Carrega as variáveis de ambiente do arquivo .env

    firebase_url = os.getenv("DATABASE_URL")
    firebase_database_url = f"{firebase_url}/{child}.json"

    # Configura os cabeçalhos da solicitação HTTP
    headers = {"Content-Type": "application/json"}

    # Envia a solicitação HTTP POST para o Firebase Realtime Database
    response = request.post(firebase_database_url, headers=headers, data=data)

    if response.status_code == 200:
        print("JSON gravado no Firebase Realtime Database com sucesso.")
    else:
        print("Ocorreu um erro ao gravar o JSON no Firebase Realtime Database.")
