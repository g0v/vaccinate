FROM python:3.8-slim-buster

WORKDIR /app

RUN pip install pipenv

COPY Pipfile* /app/
RUN pipenv install

COPY . /app

# TODO: cron job this
CMD ["pipenv", "run", "python", "/app/backend/local_scraper.py"]
