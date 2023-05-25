import re
from datetime import date as Date

from api.Lawsuit.Lawsuit import Lawsuit

from api.OABCertificate.models import CertidaoOAB
from Shared.utils import get_mounth
from Services.Pdf2Str import Pdf2Str
from Services.defensoria_oab.defensoria_oab import lawsuitClassifier


class OABCertificate:
    def __init__(self, pdf_stream) -> None:
        self.text = Pdf2Str(pdf_stream).extractText(
            text="Indicação", method="googleVision"
        )
        self.data = CertidaoOAB()
        self.extractVars()

    def __str__(self) -> str:
        return self.data.json()

    def json(self):
        return self.data.dict()

    def checkLawSuit(self, process_number: str):
        self.data.vara = 1458
        try:
            processo = Lawsuit(process_number).lawsuit
            self.data.data_transito = processo.sentenca["data_transito"]
            self.data.juizo = f"{processo.vara} do Foro de {processo.foro} da Comarca de {processo.foro}"
            self.data.partes = processo.partes
            if not self.data.assunto:
                self.data.assunto = processo.assunto

            sentenca = {"data": processo.sentenca["data"]}

            if "parcialmente procedente" in processo.sentenca["detalhe"].lower():
                sentenca["cod"] = "2"
            elif "improcedente" in processo.sentenca["detalhe"].lower():
                sentenca["cod"] = "3"
            elif "procedente" in processo.sentenca["detalhe"].lower():
                sentenca["cod"] = "1"
            elif "homologo" in processo.sentenca["detalhe"].lower():
                set_requerente = set()
                set_requerida = set()
                for d in processo.partes:
                    if d["tipo"] == "requerente":
                        set_requerente.update(d["advogado"])
                    elif d["tipo"] == "requerido":
                        set_requerida.update(d["advogado"])

                if set_requerida == set() or set_requerente == set_requerida:
                    sentenca["cod"] = "6"
                else:
                    sentenca["cod"] = "7"
            else:
                sentenca["cod"] = "5"
                padrao = r"(?:art\.|artigo) \d+(?:, (?:inc\.|inciso) [A-Z]+(?: [IVXLCDM]+))|[A-Za-z]+ \d+[^\.,:;!?]*"
                encontrado = re.search(padrao, processo.sentenca["detalhe"])
                if encontrado:
                    sentenca["complemento"] = encontrado.group()

            self.data.sentenca = sentenca

        except:
            ...

    def extractVars(self):
        self.data.processo = re.search(
            r"[0-9]{7}[-][0-9]{2}[.][0-9]{4}[.][8][.][2][6][.][0-9]{4}", self.text
        ).group()

        date = re.findall(r"sao paulo, ([\S\s]*?)\.", self.text, flags=re.IGNORECASE)
        date = map(get_mounth, date[0].split(" de ")[::-1])
        date = Date(*date)
        self.data.data_indicacao = date.strftime("%d/%m/%Y")

        subject = re.findall(
            r"qualificado\(a\) no\(a\) ([\S\s]*?)\:", self.text, flags=re.IGNORECASE
        )
        if not len(subject) > 0:
            subject = re.findall(
                r"para propor ([\S\s]*?) em favor de", self.text, flags=re.IGNORECASE
            )

        self.data.assunto = "".join(subject).replace("\n", " ")

        foro = re.search(r"foro de (.*)", self.text, flags=re.IGNORECASE)
        if foro:
            vara = foro.group(1).split("/")
            self.data.juizo = f"{vara[1].strip()} do Foro de {vara[0].strip()} da Comarca de {vara[0].strip()}"
        beneficiario = ""
        names = re.findall(
            "dpesp\:([\s\S]*?)\\nNome\:([\s\S]*?)\\n",
            self.text,
            flags=re.IGNORECASE,
        )
        for name in names:
            name = re.sub(r"[0-9]+", "", " ".join(name))

            name = (
                name.replace("\n", "")
                .replace("- ", "")
                .replace("Autor/a", "")
                .replace("Réu/Ré", "")
                .replace("Nome:", "")
            )
            beneficiario += name.strip() + ", "

        self.data.beneficiarios = beneficiario[:-2]

        self.data.autor = "autor" in self.text.lower()
        self.data.reu = "réu" in self.text.lower()

        lawyer = re.findall(
            "OAB\s*\/\s*Nome\s*:\s*([\S\s]*?)\\n", self.text, flags=re.IGNORECASE
        )

        self.data.oab, self.data.advogado = lawyer[0].split("/")
        self.data.oab = self.data.oab.strip()
        self.data.advogado = self.data.advogado.strip()

        self.data.indicacao = re.search(
            r"[0-9]{6}[ ][0-9]{6}[ ][0-9]{6}[ ][0-9]{5}", self.text
        ).group()

        self.checkLawSuit(self.data.processo)

        classifier = lawsuitClassifier()
        classifier.load_model()
        predict = classifier.predict(self.data.assunto)
        self.data.codigo = str(predict)
