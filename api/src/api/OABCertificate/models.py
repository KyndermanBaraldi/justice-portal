from pydantic import BaseModel

from api.Lawsuit.models import Processo


class CertidaoOAB(BaseModel):
    assunto: str | None = None
    juizo: str | None = None
    vara: str | None = None
    codigo: str | None = None
    processo: str | None = None
    advogado: str | None = None
    oab: str | None = None
    data_indicacao: str | None = None
    beneficiarios: str | None = None
    partes: list[dict[str, str, str]] | None = None
    autor: bool | None = None
    reu: bool | None = None
    indicacao: str | None = None
    sentenca: dict | None = None
    data_transito: str | None = None
    atos_praticados: list[str] | None = None
