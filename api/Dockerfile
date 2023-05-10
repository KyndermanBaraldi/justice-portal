FROM python:3.11-slim

RUN apt-get update \
    && apt-get -y install tesseract-ocr tesseract-ocr-por

WORKDIR /usr/src/app

EXPOSE 5001

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD [ "python", "./src/server.py" ]