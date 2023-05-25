from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse

from fastapi import UploadFile
from api.Lawsuit.models import Processo
from api.OABCertificate.models import CertidaoOAB
from api.Lawsuit.Lawsuit import Lawsuit
from api.OABCertificate.OABCertificat import OABCertificate


app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://justice-portal.vercel.app",
    "https://justice-portal-git-main-kyndermanbaraldi.vercel.app/",
    "https://justice-portal-5y65cnvya-kyndermanbaraldi.vercel.app/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
async def root():
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
async def get_lawsuit(number: str):
    return JSONResponse(content=Lawsuit(number).json())


@app.post("/certidao-oab", response_model=CertidaoOAB)
async def oabcertificate(pdf_file: UploadFile):
    pdf_steam = await pdf_file.read()
    return JSONResponse(content=OABCertificate(pdf_steam).json())
