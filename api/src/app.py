from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import UploadFile
from api.Lawsuit.models import Processo
from api.OABCertificate.models import CertidaoOAB
from api.Lawsuit.Lawsuit import Lawsuit
from api.OABCertificate.OABCertificat import OABCertificate
from api.Tax.Tax import iTax, Tax
from api.WorkdayCounter.WorkdayCounter import IWorkdayCounter, WorkdayCounter
from api.users.users import IUser, Users


app = FastAPI()
security = HTTPBearer()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
async def inicio():
    return """
    <html>
        <head>
            <title>Liga da Justiça - Api</title>
        </head>
        <body>
            <h1>Hello Word</h1>
        </body>
    </html>
    """


@app.get("/processo/{number}", response_model=Processo)
async def processo(number: str):
    return JSONResponse(content=Lawsuit(number).json())


@app.post("/certidao-oab", response_model=CertidaoOAB)
async def CertidaoOAB(pdf_file: UploadFile):
    pdf_steam = await pdf_file.read()
    return JSONResponse(content=OABCertificate(pdf_steam).json())


@app.get("/prazo", response_model=IWorkdayCounter)
async def diasUteis(inicio: str, dias: int):
    return JSONResponse(content=WorkdayCounter(inicio, dias).json())


@app.get("/taxa", response_model=iTax)
async def taxa(ano: int = None, mes: int = None):
    return JSONResponse(content=Tax(ano, mes).json())


@app.post("/usuario/cadastrar")
async def criar_usuario(usuario: IUser):
    user = Users().create_user(usuario)
    return JSONResponse(content=user)


@app.get("/usuario/me", response_model=IUser)
async def get_usuario(token: str = Depends(security)):
    if token.scheme != "Bearer":
        raise HTTPException(status_code=401, detail="Esquema de autenticação inválido")
    token = token.credentials

    user = Users().get_current_user(token)
    return JSONResponse(content=user)


@app.get("/usuario/cartorio")
async def get_cartorio(token: str = Depends(security)):
    if token.scheme != "Bearer":
        raise HTTPException(status_code=401, detail="Esquema de autenticação inválido")
    token = token.credentials
    cartorio = Users().get_cartorio(token)
    return JSONResponse(content=cartorio)
