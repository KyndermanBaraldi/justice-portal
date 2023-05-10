from bs4 import BeautifulSoup
from fastapi import HTTPException
import re
from api.Lawsuit.models import Processo
from api.WorkdayCounter.WorkdayCounter import WorkdayCounter
from Services.web_scraping import Web_scraping_lawsuit


class Lawsuit:
    def __init__(self, suit_number: str):
        self.get_lawsuit(suit_number)

    def get_lawsuit(self, suit_number: str):
        html = Web_scraping_lawsuit(suit_number).response

        soup = BeautifulSoup(html, "html.parser")

        try:
            table_parts = soup.find("table", {"id": "tableTodasPartes"})
            if not table_parts:
                table_parts = soup.find("table", {"id": "tablePartesPrincipais"})

            type_parts = [
                i.contents[0].strip()
                for i in table_parts.find_all(class_="tipoDeParticipacao")
            ]

            name_parts = []
            for i, td in enumerate(
                table_parts.find_all("td", {"class": "nomeParteEAdvogado"})
            ):
                parte = td.contents[0].strip()
                td_advogado = td.find("span", {"class": "mensagemExibindo"})

                for _parte in name_parts:
                    if parte == _parte["parte"]:
                        break
                else:
                    if td_advogado:
                        advogado = td_advogado.next_sibling.strip()

                        name_parts.append(
                            {
                                "parte": parte,
                                "advogado": advogado,
                                "tipo": type_parts[i],
                            }
                        )
                    else:
                        name_parts.append({"parte": parte, "tipo": type_parts[i]})

            table_steps = soup.find("tbody", {"id": "tabelaTodasMovimentacoes"})
            if not table_steps:
                table_steps = soup.find("tbody", {"id": "tabelaUltimasMovimentacoes"})

            date_steps = [
                i.text.strip() for i in table_steps.find_all(class_="dataMovimentacao")
            ]

            description_steps = []
            ars = []
            mandados = []

            verdict = {}
            for i, td in enumerate(
                table_steps.find_all("td", {"class": "descricaoMovimentacao"})
            ):
                detail = td.span.text.strip()
                td.span.decompose()
                movement = td.text.strip()
                if (
                    "P.R.I." in detail
                    or "PRI." in detail
                    or "PRIC." in detail
                    or "P.I.C." in detail
                    or "PIC." in detail
                    or "esta sentença" in detail
                    or "Diante do exposto, e do mais que dos autos consta" in detail
                    or "dou o feito por extinto" in detail
                ):
                    if movement == "Remetido ao DJE":
                        verdict["publicação"] = date_steps[i]
                    else:
                        verdict["sentença"] = movement
                        verdict["detalhe"] = detail
                        verdict["data da sentença"] = date_steps[i]

                        if "preclusão lógica" in detail:
                            verdict["trânsito em julgado"] = date_steps[i]
                        elif "publicação" in verdict:
                            verdict["trânsito em julgado"] = self.getTJ(
                                verdict["publicação"]
                            )

                if "Expedid" in movement and "Carta de" in movement:
                    ars.append(
                        {
                            "movimento": movement,
                            "detalhe": detail,
                            "data": date_steps[i],
                        }
                    )

                if "Expedid" in movement and "Mandado" in movement:
                    mandados.append(
                        {
                            "movimento": movement,
                            "detalhe": detail,
                            "data": date_steps[i],
                        }
                    )

                try:
                    juiz = soup.find(id="juizProcesso").text.strip()
                except:
                    juiz = ""

                description_steps.append(
                    {"movimento": movement, "detalhe": detail, "data": date_steps[i]}
                )

            self.lawsuit = Processo(
                numero=suit_number,
                distribuicao=soup.find(id="dataHoraDistribuicaoProcesso").text.strip(),
                foro=soup.find(id="foroProcesso").text.strip(),
                vara=soup.find(id="varaProcesso").text.strip(),
                classe=soup.find(id="classeProcesso").text.strip(),
                assunto=soup.find(id="assuntoProcesso").text.strip(),
                area=soup.find(id="areaProcesso").text.strip(),
                juiz=juiz,
                valor=float(
                    re.sub(
                        r"[^\d,]",
                        "",
                        soup.find(id="valorAcaoProcesso").contents[0].strip(),
                    ).replace(",", ".")
                ),
                partes=name_parts,
                ars_expedidos=ars,
                mandados_expedidos=mandados,
                sentenca=verdict,
                movimentacao=description_steps,
            )

        except:
            raise HTTPException(status_code=404, detail="Processo não encontrado")

    def getTJ(self, date):
        return WorkdayCounter(date, 15).json()["end_date"]

    def json(self):
        return self.lawsuit.dict()
