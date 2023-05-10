import requests
import pandas as pd
from Shared.utils import set_last_day
from bs4 import BeautifulSoup


class Web_scraping_lawsuit:
    def __init__(self, suit_number: str):
        self.BASE_URL = "https://esaj.tjsp.jus.br/cpopg/search.do"
        self.response = self.web_scraping_lawsuit(suit_number)

    def web_scraping_lawsuit(self, suit_number: str) -> str:
        params = (
            ("conversationId", ""),
            ("cbPesquisa", "NUMPROC"),
            ("numeroDigitoAnoUnificado", suit_number[:-10]),
            ("foroNumeroUnificado", suit_number[-4:]),
            ("dadosConsulta.valorConsultaNuUnificado", suit_number),
            ("dadosConsulta.valorConsultaNuUnificado", "UNIFICADO"),
            ("dadosConsulta.valorConsulta", ""),
            ("dadosConsulta.tipoNuProcesso", "UNIFICADO"),
        )

        return requests.get(self.BASE_URL, params=params).content


class Web_scraping_tax:
    def __init__(self):
        self.BASE_URL = "https://www.tjsp.jus.br/PrimeiraInstancia/CalculosJudiciais/Comunicado?codigoComunicado=25988&pagina=1"
        self.FILE_URL = self.get_url()
        self.response = self.get_data()

    def get_url(self) -> str:
        html = requests.get(self.BASE_URL).content
        soup = BeautifulSoup(html, "html.parser")
        soup.find_all("a", {"title": "2. Planilha Taxa Judiciária"})
        return soup.find_all("a", {"title": "2. Planilha Taxa Judiciária"})[0].get(
            "href"
        )

    def get_data(self) -> pd.DataFrame:
        df = pd.read_excel(
            self.FILE_URL, sheet_name="ÍNDICES", usecols="B,X,Z,AI", skiprows=3
        )
        df.columns = ["initial_date", "unit", "ufesp", "rate"]

        df = df.dropna(subset=["rate"])
        df["ufesp"] = df["ufesp"].fillna(0)
        df[["ufesp", "rate"]] = df[["ufesp", "rate"]].replace({",": "."}, regex=True)

        df["year"] = df["initial_date"].dt.year
        df["mounth"] = df["initial_date"].dt.month

        df["final_date"] = df["initial_date"].apply(set_last_day).astype("str")
        df["initial_date"] = df["initial_date"].astype("str")

        return df.to_json(orient="records")
