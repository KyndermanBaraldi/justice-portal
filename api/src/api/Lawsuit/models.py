from pydantic import BaseModel


class Processo(BaseModel):
    numero: str | None
    distribuicao: str | None
    foro: str | None
    vara: str | None
    classe: str | None
    assunto: str | None
    area: str | None
    juiz: str | None
    partes: list[dict[str, str, str]] | None
    ars_expedidos: list[dict[str, str, str]] | None
    mandados_expedidos: list[dict[str, str, str]] | None
    movimentacao: list[dict[str, str, str]] | None
    valor: float | None
    sentenca: dict[str, str, str, str] | None
