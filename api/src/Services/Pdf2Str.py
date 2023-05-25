import os
import re
from PIL import Image
from dotenv import load_dotenv
from fastapi import HTTPException
import pytesseract
import fitz
import base64
import requests


class Pdf2Str:
    def __init__(self, pdf_stream, zoom_x: float = 2.0, zoom_y: float = 2.0) -> None:
        self.zoom_x = zoom_x
        self.zoom_y = zoom_y
        if isinstance(pdf_stream, str):
            try:
                doc = fitz.open(pdf_stream)
            except:
                raise HTTPException(status_code=400, detail="invalid pdf file.")
        elif isinstance(pdf_stream, bytes):
            try:
                doc = fitz.open(None, pdf_stream, "pdf")
            except:
                raise HTTPException(status_code=400, detail="invalid pdf file.")

        self.text = "\n".join([page.get_text() for page in doc])
        self.imageBlobs = self.getPages(doc)
        doc.close()

    def getPages(self, pdf_stream):
        mat = fitz.Matrix(self.zoom_x, self.zoom_y)
        imageBlobs = []
        for page in pdf_stream:
            pix = page.get_pixmap(matrix=mat)  # render page to an image
            imageBlobs.append(pix)
        return imageBlobs

    def removeEmptyLines(self, text: str) -> str:
        cleaned_text = re.sub(r"\n\s*\n", "\n", text)  # Remove linhas vazias
        cleaned_text = re.sub(
            r"\n{2,}", "\n", cleaned_text
        )  # Remove quebras de linha consecutivas
        cleaned_text = (
            cleaned_text.strip()
        )  # Remove espaços em branco no início e no final do texto
        return cleaned_text

    def extractText(self, method: str = "tesseract", text: str = "") -> str:
        if not text in self.text:
            self.text = (
                self.googleVision() if method == "googleVision" else self.tesseract()
            )

        return self.removeEmptyLines(self.text)

    def tesseract(self) -> str:
        extract = []
        for imgBlob in self.imageBlobs:
            image = Image.frombytes(
                "RGB", [imgBlob.width, imgBlob.height], imgBlob.samples
            )
            text = pytesseract.image_to_string(image, lang="por")
            extract.append(text)
        return "\n".join(extract)

    def googleVision(self) -> str:
        load_dotenv()
        data = {"requests": []}
        url = os.getenv("GOOGLE_VISION_URL")
        for page in self.imageBlobs:
            # image = Image.frombytes("RGB", [page.width, page.height], page.samples)
            page_base64 = base64.b64encode(page.tobytes())
            annotateImageRequest = {
                "image": {"content": page_base64.decode("utf-8")},
                "features": [{"type": "TEXT_DETECTION"}],
            }
            data["requests"].append(annotateImageRequest)

        r = requests.post(url, json=data)
        response = r.json()

        extracted_text = []
        if "responses" in response:
            for resp in response["responses"]:
                if "textAnnotations" in resp:
                    extracted_text.append(resp["textAnnotations"][0]["description"])

        return "\n".join(extracted_text)
