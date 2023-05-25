import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.exceptions import NotFittedError
import joblib

import os


class lawsuitClassifier:
    MODEL_FILE_PATH = "./src/database/model.joblib"

    def __init__(self):
        self.vectorizer = CountVectorizer()
        self.model = MultinomialNB()

    def train(self, data_file_path: str) -> None:
        # Carregando os dados
        data = pd.read_csv(data_file_path, delimiter=";")
        # Convertendo todas as strings para minúsculas
        data = data.applymap(lambda x: x.lower() if isinstance(x, str) else x)
        # Concatenar as colunas Tipo e Natureza da Ação
        data["Tipo-Natureza"] = data["Tipo"] + "-" + data["Natureza da Ação"]
        # Converter o texto em uma matriz de recursos usando CountVectorizer
        features = self.vectorizer.fit_transform(data["Tipo-Natureza"])
        # Treinar o modelo Naive Bayes
        self.model.fit(features, data["Códigos"])
        # Salvar o modelo treinado usando joblib
        joblib.dump((self.vectorizer, self.model), self.MODEL_FILE_PATH)

    def predict(self, text: str) -> str:
        try:
            # Transformar o texto em recursos usando o CountVectorizer treinado
            features = self.vectorizer.transform([text])
            # Fazer a previsão usando o modelo treinado
            codigo_previsto = self.model.predict(features)
            # Retornar o código previsto
            return codigo_previsto[0]
        except NotFittedError:
            raise NotFittedError(
                "Modelo não treinado. Por favor, chame o método train primeiro."
            )

    def load_model(self) -> None:
        # Carregar o modelo salvo usando joblib
        print("ok")
        dir_path = os.path.dirname(os.path.realpath(__file__))
        print(dir_path)
        self.vectorizer, self.model = joblib.load(self.MODEL_FILE_PATH)


# Criando uma instância da classe AcaoClassifier e treinando o modelo


if __name__ == "__main__":
    classifier = lawsuitClassifier()
    # classifier.train("./cod_oab.csv")
    classifier.load_model()

    # Fazendo uma previsão
    codigo_acao = classifier.predict("guarda")

    # Exibindo o código da ação correspondente
    print(codigo_acao)
