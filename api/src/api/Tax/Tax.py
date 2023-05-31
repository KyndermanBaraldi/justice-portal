from fastapi import HTTPException
from pydantic import BaseModel

from Services.firebase import FirebaseClient
from Services.web_scraping import Web_scraping_tax

from datetime import date


class iTax(BaseModel):
    unit: str
    ufesp: float
    rate: float


class Tax:
    def __init__(self, year: int = None, month: int = None):
        self.year = year
        self.month = month

    def get_tax(self):
        firebase_client = FirebaseClient()

        if self.year is None or self.month is None:
            self.year = date.today().year
            self.month = date.today().month

        child_path = "indices/{}/{}".format(self.year, self.month)

        yax = firebase_client.get_data(child_path)

        if yax:
            return iTax(**yax).dict()

        try:
            data = Web_scraping_tax().get_data(year=self.year, month=self.month)
            yax = data[0][self.year][0][self.month]
            firebase_client.save_data(child_path, yax)
            return iTax(**yax).dict()
        except:
            raise HTTPException(
                404,
                "Não foi possível encontrar os dados para o ano {} e mês {}".format(
                    self.year, self.month
                ),
            )

    def json(self):
        return self.get_tax()
