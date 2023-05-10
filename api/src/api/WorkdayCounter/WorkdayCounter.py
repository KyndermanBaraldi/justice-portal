from datetime import date, timedelta
from fastapi import HTTPException
from pydantic import BaseModel
from Shared.utils import iso_to_br, validationDate


class IWorkdayCounter(BaseModel):
    start_date: date
    working_days: int
    end_date: date | None
    non_working_days: list = []


class WorkdayCounter:
    def __init__(self, _date: str, _working_days: int) -> None:
        _date = validationDate(_date)
        if not _date:
            raise HTTPException(status_code=400, detail="Formato de data inválido")

        self.workdayCounter = IWorkdayCounter(
            start_date=_date, working_days=_working_days
        )
        self.getSuspension(_date.year)
        self.getHolidays(_date.year)
        self.count_workdays()

    def getSuspension(self, year: int):
        suspension = {
            2023: (
                {
                    "start": "2023-01-01",
                    "end": "2023-01-06",
                    "description": "Recesso Forense - Art. 116, § 2º do RITJSP",
                },
                {
                    "start": "2023-01-07",
                    "end": "2023-01-20",
                    "description": "Suspensão dos prazos processuais - Art. 116, § 2º do RITJSP",
                },
                {
                    "start": "2023-12-20",
                    "end": "2023-12-31",
                    "description": "Recesso Forense - Art. 116, § 2º do RITJSP",
                },
            ),
            2022: (
                {
                    "start": "2022-01-01",
                    "end": "2022-01-06",
                    "description": "Recesso - Art. 116, § 2º do RITJSP",
                },
                {
                    "start": "2022-01-07",
                    "end": "2022-01-20",
                    "description": "Art. 116, § 2º do RITJSP",
                },
                {
                    "start": "2022-12-20",
                    "end": "2022-12-31",
                    "description": "Recesso Forense - Art. 116, § 2º do RITJSP",
                },
            ),
        }
        self.suspension = dict((k, suspension[k]) for k in [year])

    def getHolidays(self, year: int):
        holidays = {
            2023: {
                "2023-01-01": "CONFRATERNIZAÇÃO UNIVERSAL",
                "2023-02-20": "VÉSPERA DE CARNAVAL (PROVIMENTO CSM Nº 2.678/2022)",
                "2023-02-21": "CARNAVAL (PROVIMENTO CSM Nº 2.678/2022)",
                "2023-04-06": "ENDOENÇAS (PROVIMENTO CSM Nº 2.678/2022)",
                "2023-04-07": "SEXTA-FEIRA SANTA (PROVIMENTO CSM Nº 2.678/2022)",
                "2023-04-21": "TIRADENTES (PROVIMENTO CSM Nº 2.678/2022)",
                "2023-05-01": "DIA DO TRABALHO (PROVIMENTO CSM Nº 2.678/2022)",
                "2023-06-08": '"CORPUS-CHRISTI" (PROVIMENTO CSM Nº 2.678/2022)',
                "2023-08-06": "SENHOR BOM JESUS",
                "2023-09-07": "INDEPENDÊNCIA DO BRASIL",
                "2023-10-12": "NOSSA SENHORA DE APARECIDA",
                "2023-11-02": "FINADOS",
                "2023-11-15": "PROCLAMAÇÃO DA REPÚBLICA",
                "2023-11-26": "DIA DA CIDADE",
                "2023-12-08": "DIA DA JUSTIÇA",
                "2023-12-25": "NATAL",
                "2023-06-09": "Suspensão do expediente - Provimento CSM nº 2678/2022",
                "2023-09-08": "Suspensão do expediente - Provimento CSM nº 2678/2022",
                "2023-10-13": "Suspensão do expediente - Provimento CSM nº 2678/2022",
                "2023-11-03": "Suspensão do expediente - Provimento CSM nº 2678/2022",
            },
            2022: {
                "2022-01-01": "CONFRATERNIZAÇÃO UNIVERSAL",
                "2022-02-28": "VÉSPERA DE CARNAVAL (PROV. CSM 2641/2021)",
                "2022-03-01": "CARNAVAL (PROV. CSM 2641/2021)",
                "2022-04-14": "ENDOENÇAS (PROV. CSM 2641/2021)",
                "2022-04-15": "SEXTA-FEIRA SANTA (PROV. CSM 2641/2021)",
                "2022-04-21": "TIRADENTES (PROV. CSM 2641/2021)",
                "2022-06-16": "CORPUS CHRISTI (PROV. CSM 2641/2021)",
                "2022-08-06": "SENHOR BOM JESUS",
                "2022-09-07": "INDEPENDÊNCIA DO BRASIL (PROV. CSM 2641/2021)",
                "2022-10-12": "NOSSA SENHORA DE APARECIDA (PROV. CSM 2641/2021)",
                "2022-10-28": "DIA DO FUNCIONÁRIO PÚBLICO (PROV. CSM 2641/2021)",
                "2022-11-02": "FINADOS (PROV. CSM 2641/2021)",
                "2022-11-15": "PROCLAMAÇÃO DA REPÚBLICA (PROV. CSM 2641/2021)",
                "2022-11-26": "DIA DA CIDADE",
                "2022-12-09": "DIA DA JUSTIÇA (PROVIMENTO CSM Nº 2677/2022)",
                "2022-04-22": "Suspensão de expediente (Prov. CSM 2641/2021)",
                "2022-06-17": "Suspensão de expediente (Prov. CSM 2641/2021)",
                "2022-11-14": "Suspensão de expediente (Prov. CSM 2641/2021)",
            },
        }
        self.holidays = dict((k, holidays[k]) for k in [year])

    def work_day(self, _date: date) -> int:
        if _date.year not in self.suspension or _date.year not in self.holidays:
            self.getSuspension(_date.year)
            self.getHolidays(_date.year)

        for suspension in self.suspension[_date.year]:
            _startdate = date.fromisoformat(suspension["start"])
            _enddate = date.fromisoformat(suspension["end"])
            if _startdate <= _date and _enddate >= _date:
                self.workdayCounter.non_working_days.append(
                    {
                        "{} a {}".format(
                            iso_to_br(suspension["start"]), iso_to_br(suspension["end"])
                        ): suspension["description"]
                    }
                )
                return (_enddate - _date).days + 1
        if _date.weekday() == 5:
            self.workdayCounter.non_working_days.append(
                {_date.strftime("%d/%m/%Y"): "Sábado"}
            )
            self.workdayCounter.non_working_days.append(
                {iso_to_br(str(_date + timedelta(1))): "Domingo"}
            )
            return 2
        elif _date.weekday() == 6:
            self.workdayCounter.non_working_days.append(
                {_date.strftime("%d/%m/%Y"): "Domingo"}
            )
            return 1
        elif str(_date) in self.holidays[_date.year]:
            self.workdayCounter.non_working_days.append(
                {_date.strftime("%d/%m/%Y"): self.holidays[_date.year][str(_date)]}
            )
            return 1
        else:
            return 0

    def update_date(self, _date: date, _days: int = 1) -> date:
        while True:
            _delta = self.work_day(_date)
            if _delta != 0:
                _date += timedelta(_delta)
            else:
                _date += timedelta(_days)
                break
        return _date

    def count_workdays(self) -> str:
        _date = self.workdayCounter.start_date
        for _ in range(self.workdayCounter.working_days):
            _date = self.update_date(_date)

        self.workdayCounter.end_date = self.update_date(_date, 0)

    def json(self) -> dict:
        response = self.workdayCounter.dict().copy()
        response["start_date"] = self.workdayCounter.start_date.strftime("%d/%m/%Y")
        response["end_date"] = self.workdayCounter.end_date.strftime("%d/%m/%Y")

        return response


# countworkdays = WorkdayCounter('02/02/2023', 15).json()

# print(countworkdays)
