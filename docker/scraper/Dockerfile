FROM python:3.8-slim-buster

WORKDIR /app

RUN pip install pipenv

COPY Pipfile* /app/
RUN pipenv install

COPY backend/Parsers/* /app/backend/Parsers/
COPY backend/hospital_types.py /app/backend/
COPY backend/local_scraper.py /app/backend/
COPY scraper.sh /app/

CMD ["/"]
