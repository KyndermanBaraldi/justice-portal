from calendar import monthrange
from datetime import datetime, date
import re


def br_to_iso(date_str):
    date_obj = datetime.strptime(date_str, "%d/%m/%Y")
    return date_obj.date().isoformat()


def iso_to_br(date_str):
    date_obj = datetime.fromisoformat(date_str)
    return date_obj.strftime("%d/%m/%Y")


def set_last_day(current_date: date) -> date:
    last_date = current_date.replace(
        day=monthrange(current_date.year, current_date.month)[1]
    )
    return last_date


def set_first_day(current_date: date) -> date:
    last_date = current_date.replace(day=1)
    return last_date


def validationDate(_date: str) -> date:
    padrao_iso = re.compile(r"^\d{4}-\d{2}-\d{2}$")
    padrao_br = re.compile(r"^\d{2}/\d{2}/\d{4}$")

    if padrao_iso.match(_date):
        return date.fromisoformat(_date)
    elif padrao_br.match(_date):
        return date.fromisoformat(br_to_iso(_date))
    else:
        return False


def get_mounth(x: str) -> int:
    months = {
        "janeiro": 1,
        "fevereiro": 2,
        "março": 3,
        "abril": 4,
        "maio": 5,
        "junho": 6,
        "julho": 7,
        "agosto": 8,
        "setembro": 9,
        "outubro": 10,
        "novembro": 11,
        "dezembro": 12,
    }

    try:
        return int(x[:4])
    except:
        return months.get(x.lower(), None)
