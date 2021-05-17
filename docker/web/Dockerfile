FROM node:lts as build_react

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app
RUN yarn build

# -----------------8<----------------------

FROM python:3.8-slim-buster

WORKDIR /app

COPY --from=build_react /app/dist /app/dist

RUN pip install pipenv

COPY Pipfile* /app/
RUN pipenv install

COPY . /app

# FIXME: some paths are CWD-sensitive, e.g. reading '../data/hospitals.csv'
WORKDIR /app/backend

# FIXME: error message says I'm using a non-production-ready server.
CMD ["pipenv", "run", "python", "/app/backend/app.py"]
