from datetime import date, timedelta
from fastapi import HTTPException
from pydantic import BaseModel
from Services.web_scraping import Web_Hollidays
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
        city = "tremembe"
        self.H = Web_Hollidays(city)
        self.suspension = self.H.getSuspensions(_date.year)
        self.holidays = self.H.getHolidays(_date.year)
        self.count_workdays()

    def work_day(self, _date: date) -> int:
        if _date.year not in self.suspension or _date.year not in self.holidays:
            self.suspension = self.H.getSuspensions(_date.year)
            self.holidays = self.H.getHolidays(_date.year)

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
