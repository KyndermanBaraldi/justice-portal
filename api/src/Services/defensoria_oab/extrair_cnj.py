import json
import csv
import re
from bs4 import BeautifulSoup

from defensoria_oab import classifier

codigo_tipo_dict = {
    "101": {
        "Natureza da Ação": "Procedimento Ordinário / Comum (Residual)",
        "Tipo": "Cível",
    },
    "102": {
        "Natureza da Ação": "Procedimento Sumário (Nomeações Realizadas até 18/03/2016)",
        "Tipo": "Cível",
    },
    "103": {
        "Natureza da Ação": "Execução de Título Extrajudicial e Judicial",
        "Tipo": "Cível",
    },
    "104": {"Natureza da Ação": "Declaratórias", "Tipo": "Cível"},
    "105": {"Natureza da Ação": "Embargos de Terceiros", "Tipo": "Cível"},
    "106": {
        "Natureza da Ação": "Procedimento Especial - Jurisdição Voluntária ou Contenciosa",
        "Tipo": "Cível",
    },
    "107": {"Natureza da Ação": "Consignação em Pagamento", "Tipo": "Cível"},
    "108": {"Natureza da Ação": "Possessórias (Usocapião)", "Tipo": "Cível"},
    "109": {"Natureza da Ação": "Nunciação de Obra Nova", "Tipo": "Cível"},
    "110": {"Natureza da Ação": "Anulação e Retificação de Registro", "Tipo": "Cível"},
    "111": {"Natureza da Ação": "Despejo", "Tipo": "Cível"},
    "112": {"Natureza da Ação": "Revisional de Aluguel", "Tipo": "Cível"},
    "113": {"Natureza da Ação": "Mandado de Segurança", "Tipo": "Cível"},
    "114": {"Natureza da Ação": "Processos Cautelares", "Tipo": "Cível"},
    "115": {"Natureza da Ação": "Curador Especial", "Tipo": "Cível"},
    "116": {
        "Natureza da Ação": "Juizado Especial Cível e da Fazenda Pública",
        "Tipo": "Cível",
    },
    "117": {
        "Natureza da Ação": "Medida Protetiva à mulher vítima de violência doméstica",
        "Tipo": "Cível",
    },
    "209": {"Natureza da Ação": "Pedido de Alvará", "Tipo": "Cível"},
    "200": {
        "Natureza da Ação": "Cumprimento de Sentença - Alimentos",
        "Tipo": "Família e Sucessões",
    },
    "201": {
        "Natureza da Ação": "Inventários e Arrolamentos",
        "Tipo": "Família e Sucessões",
    },
    "202": {
        "Natureza da Ação": "Separação, Divórcio, Conv. em Divórcio Consensual e Reconhecimento e Dissolução de União Estável",
        "Tipo": "Família e Sucessões",
    },
    "203": {
        "Natureza da Ação": "Separação, Divórcio, Conv. em Divórcio Litigioso e Reconhecimento e Dissolução de União Estável",
        "Tipo": "Família e Sucessões",
    },
    "203": {
        "Natureza da Ação": "Separação, Divórcio, Conv. em Divórcio Litigioso e Reconhecimento e Dissolução de União Estável",
        "Tipo": "Família e Sucessões",
    },
    "204": {"Natureza da Ação": "Anulação de Casamento", "Tipo": "Família e Sucessões"},
    "205": {
        "Natureza da Ação": "Investigação de Paternidade",
        "Tipo": "Família e Sucessões",
    },
    "206": {
        "Natureza da Ação": "Alimentos (Processo de Conhecimento)",
        "Tipo": "Família e Sucessões",
    },
    "207": {"Natureza da Ação": "Tutela e Curatela", "Tipo": "Família e Sucessões"},
    "208": {
        "Natureza da Ação": "Emancipação Judicial Outorgada Judic. e Consentimento",
        "Tipo": "Família e Sucessões",
    },
    "209": {"Natureza da Ação": "Pedido de Alvará", "Tipo": "Família e Sucessões"},
    "210": {
        "Natureza da Ação": "Modificação ou Regulamento de Guarda / Visitas",
        "Tipo": "Família e Sucessões",
    },
    "114": {"Natureza da Ação": "Processo Cautelar", "Tipo": "Família e Sucessões"},
    "115": {"Natureza da Ação": "Curador Especial", "Tipo": "Família e Sucessões"},
    "301": {"Natureza da Ação": "Rito Ordinário", "Tipo": "Criminal"},
    "302": {"Natureza da Ação": "Rito Sumário", "Tipo": "Criminal"},
    "315": {"Natureza da Ação": "Rito Sumaríssimo", "Tipo": "Criminal"},
    "303": {"Natureza da Ação": "Defesa Júri até Pronúncia", "Tipo": "Criminal"},
    "304": {
        "Natureza da Ação": "Defesa Júri da Pronúncia ao Final do Processo",
        "Tipo": "Criminal",
    },
    "306": {
        "Natureza da Ação": "Advogado do Querelante (Queixa-crime Subsidiária da Pública)",
        "Tipo": "Criminal",
    },
    "309": {"Natureza da Ação": "Pedido de Reabilitação Criminal", "Tipo": "Criminal"},
    "310": {"Natureza da Ação": "Execução Penal", "Tipo": "Criminal"},
    "316": {"Natureza da Ação": "Violência Doméstica", "Tipo": "Criminal"},
    "317": {"Natureza da Ação": "Depoimento Especial pela vítima", "Tipo": "Criminal"},
    "501": {
        "Natureza da Ação": "Qualquer Procedimento na Área Cível",
        "Tipo": "Infância e Juventude",
    },
    "502": {
        "Natureza da Ação": "Qualquer Procedimento na Área Criminal",
        "Tipo": "Infância e Juventude",
    },
    "601": {"Natureza da Ação": "Carta Precatória", "Tipo": "Carta Precatória"},
    "701": {"Natureza da Ação": "Plantão", "Tipo": "Plantão"},
    "801": {
        "Natureza da Ação": "Atuação em um dia não útil",
        "Tipo": "Plantão em dias não úteis",
    },
    "802": {
        "Natureza da Ação": "Atuação em dois dias não úteis Consecutivos",
        "Tipo": "Plantão em dias não úteis",
    },
}


def remove_tags_html(text):
    try:
        soup = BeautifulSoup(text, "html.parser")
        return soup.get_text()
    except:
        return text


def sanitize_text(text):
    text = remove_tags_html(text)

    # remove caracteres especiais, mantendo apenas letras, números e pontuação
    text = re.sub(r"[^\w\s.,;?!-]", "", text)

    # remove espaços em excesso
    text = re.sub(r"\s+", " ", text.strip())

    text = re.sub(r"\.+", ".", text)

    # text = text.replace('ccedil;', 'ç').replace('atilde;', 'ã').replace(';', ',')
    # remove os dois pontos no final da string
    # text = text.strip().rstrip(':')

    return text


def get_type(codigo):
    codigo_str = str(codigo)
    if codigo_str in codigo_tipo_dict:
        return codigo_tipo_dict[codigo_str]["Tipo"]
    else:
        return ""


# Abrir o arquivo JSON
with open("./certidaoOab/assunto.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Filtrar apenas os objetos que atendem à condição
filtered_data = [obj for obj in data if obj["justica_estadual_1grau"] == "S"]


# Carregando o modelo
classifier.load_model()


# Extrair as informações necessárias de cada objeto JSON
rows = []
for obj in filtered_data:
    natureza = sanitize_text(obj["nome"])
    if len(natureza) > 5:
        codigo = classifier.predict(natureza)
        tipo = get_type(codigo)
        rows.append([codigo, natureza, tipo])

# Escrever as informações em um arquivo CSV
with open("assunto.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f, delimiter=";")
    writer.writerow(["Código", "Natureza da Ação", "Tipo"])
    writer.writerows(rows)
