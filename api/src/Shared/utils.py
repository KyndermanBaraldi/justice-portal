from calendar import monthrange
from datetime import datetime, date, timedelta
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


def calculate_easter(year):
    # Cálculo da data da Páscoa utilizando o algoritmo de Meeus/Jones/Butcher

    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451

    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1

    easter_date = date(year, month, day)

    return easter_date


def calculate_holidays(year):
    holidays = {}

    # Páscoa
    easter_date = calculate_easter(year)

    holidays[sexta_date.isoformat()] = "Sexta-feira Santa"

    # Véspera de Carnaval (48 dias antes da Páscoa)
    carnaval_date = easter_date - timedelta(days=48)
    holidays[carnaval_date.isoformat()] = "Véspera de Carnaval"

    # Carnaval (47 dias antes da Páscoa)
    carnaval_date = easter_date - timedelta(days=47)
    holidays[carnaval_date.isoformat()] = "Carnaval"

    # Endoenças (3 dias antes da Páscoa)
    endoenças_date = easter_date - timedelta(days=3)
    holidays[endoenças_date.isoformat()] = "Endoenças"

    # Sexta-feira santa (2 dias antes da Páscoa)
    sexta_date = easter_date - timedelta(days=2)

    # Corpus Christi (60 dias após a Páscoa)
    corpus_christi_date = easter_date + timedelta(days=60)
    holidays[corpus_christi_date.isoformat()] = "Corpus Christi"

    corpus_christi_emenda = easter_date + timedelta(days=61)
    holidays[corpus_christi_emenda.isoformat()] = "Suspensão de expediente"

    return holidays


def calcula_feriados(ano):
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
