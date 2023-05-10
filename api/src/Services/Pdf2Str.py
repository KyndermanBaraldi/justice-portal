from PIL import Image
from fastapi import HTTPException
import pytesseract
import fitz


class Pdf2Str:
    def __init__(self, pdf_stream, zoom_x: float = 2.0, zoom_y: float = 2.0) -> None:
        self.zoom_x = zoom_x
        self.zoom_y = zoom_y
        if isinstance(pdf_stream, str):
            try:
                self.doc = fitz.open(pdf_stream)
            except:
                raise HTTPException(status_code=400, detail="invalid pdf file.")
        elif isinstance(pdf_stream, bytes):
            try:
                self.doc = fitz.open(None, pdf_stream, "pdf")
            except:
                raise HTTPException(status_code=400, detail="invalid pdf file.")

    def extractText(self) -> str:
        mat = fitz.Matrix(self.zoom_x, self.zoom_y)
        imageBlobs = []
        for page in self.doc:
            pix = page.get_pixmap(matrix=mat)  # render page to an image
            imageBlobs.append(pix)

        extract = []
        for imgBlob in imageBlobs:
            image = Image.frombytes(
                "RGB", [imgBlob.width, imgBlob.height], imgBlob.samples
            )
            text = pytesseract.image_to_string(image, lang="por")
            extract.append(text)

        return "\n".join(extract)
