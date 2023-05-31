import requests
import pandas as pd
from Shared.utils import br_to_iso, calculate_holidays, set_last_day
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
        self.json = self.get_data()

    def get_url(self) -> str:
        html = requests.get(self.BASE_URL).content
        soup = BeautifulSoup(html, "html.parser")
        soup.find_all("a", {"title": "2. Planilha Taxa Judiciária"})
        return soup.find_all("a", {"title": "2. Planilha Taxa Judiciária"})[0].get(
            "href"
        )

    def create_json(self, df: pd.DataFrame) -> dict:
        json_data = []
        for _, row in df.iterrows():
            year = row["year"]
            month = row["month"]
            unit = row["unit"]
            rate = row["rate"]
            ufesp = row["ufesp"]

            year_dict = next((item for item in json_data if year in item), {})
            month_list = year_dict.get(year, [])
            month_dict = next((item for item in month_list if month in item), {})
            day_data = {"unit": unit, "ufesp": ufesp, "rate": rate}

            if not month_dict:
                month_dict = {month: day_data}
                if not year_dict:
                    year_dict = {year: [month_dict]}
                    json_data.append(year_dict)
                else:
                    month_list.append(month_dict)
            else:
                month_dict.update({month: day_data})

        return json_data

    def get_data(self, month=None, year=None) -> dict:
        df = pd.read_excel(
            self.FILE_URL, sheet_name="ÍNDICES", usecols="B,X,Z,AI", skiprows=3
        )
        df.columns = ["initial_date", "unit", "ufesp", "rate"]

        df = df.dropna(subset=["rate"])
        df["ufesp"] = df["ufesp"].fillna(0)
        df[["ufesp", "rate"]] = df[["ufesp", "rate"]].replace({",": "."}, regex=True)

        df["year"] = df["initial_date"].dt.year
        df["month"] = df["initial_date"].dt.month

        df["final_date"] = df["initial_date"].apply(set_last_day).astype("str")
        df["initial_date"] = df["initial_date"].astype("str")

        if year:
            df = df[df["year"] == year]
        if month:
            df = df[df["month"] == month]

        # return df.to_json(orient="records")
        return self.create_json(df)


class Web_Hollidays:
    def __init__(self, city):
        self.city = self._getCities(city)

    def _getCities(self, city):
        url = "https://www.tjsp.jus.br/AutoComplete/ListarMunicipios"
        headers = {"Content-Type": "application/json"}
        data = {"texto": city}

        response = requests.post(url, headers=headers, json=data)

        return response.json()[0]

    def _getHolidays(self, year):
        url = "https://www.tjsp.jus.br/CanaisComunicacao/Feriados/PesquisarFeriados"
        params = {
            "nomeMunicipio": self.city["Descricao"],
            "codigoMunicipio": self.city["Codigo"],
            "ano": year,
        }

        response = requests.get(url, params=params)
        return response.json()["data"]

    def _getSuspensions(self, year):
        url = "https://www.tjsp.jus.br/CanaisComunicacao/Feriados/PesquisarSuspensoes"
        params = {
            "nomeMunicipio": self.city["Descricao"],
            "codigoMunicipio": self.city["Codigo"],
            "ano": year,
        }

        response = requests.get(url, params=params)
        return response.json()["data"]

    def getHolidays(self, year):
        response = {}
        for holiday in self._getHolidays(year):
            date = br_to_iso(holiday["Data"])
            response[date] = holiday["Descricao"]

        if len(response) == 0:
            response = self.calcula_feriados(year)
        return {year: response}

    def getSuspensions(self, year):
        response = []
        for suspension in self._getSuspensions(year):
            try:
                start, end = suspension["Data"].split(" a ")
            except:
                start = suspension["Data"]
                end = suspension["Data"]

            response.append(
                {
                    "start": br_to_iso(start),
                    "end": br_to_iso(end),
                    "description": suspension["Descricao"],
                }
            )

        if len(response) == 0:
            response = self.calcula_suspensao(year)

        return {year: response}

    def calcula_feriados(self, ano):
        holidays = {
            "01-01": "CONFRATERNIZAÇÃO UNIVERSAL",
            "04-21": "TIRADENTES",
            "05-01": "DIA DO TRABALHO",
            "08-06": "SENHOR BOM JESUS",
            "09-07": "INDEPENDÊNCIA DO BRASIL",
            "10-12": "NOSSA SENHORA DE APARECIDA",
            "11-02": "FINADOS",
            "11-15": "PROCLAMAÇÃO DA REPÚBLICA",
            "11-26": "DIA DA CIDADE",
            "12-08": "DIA DA JUSTIÇA",
            "12-25": "NATAL",
        }

        feriados = calculate_holidays(ano)
        for data in holidays:
            feriado = f"{ano}-{data}"
            feriados[feriado] = holidays[data]

        return feriados

    def calcula_suspensao(self, ano):
        suspension = (
            {
                "start": ano + "-01-01",
                "end": ano + "-01-06",
                "description": "Recesso Forense - Art. 116, § 2º do RITJSP",
            },
            {
                "start": ano + "-01-07",
                "end": ano + "-01-20",
                "description": "Suspensão dos prazos processuais - Art. 116, § 2º do RITJSP",
            },
            {
                "start": ano + "-12-20",
                "end": ano + "-12-31",
                "description": "Recesso Forense - Art. 116, § 2º do RITJSP",
            },
        )

        return suspension
