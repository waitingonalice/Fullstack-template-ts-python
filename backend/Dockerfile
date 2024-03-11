FROM python:3.11-alpine as base

WORKDIR /app

RUN \
  apk add --no-cache postgresql-libs && \
  apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev

COPY ./Pipfile ./Pipfile.lock /app/
RUN pip install pipenv && pipenv install --deploy --ignore-pipfile

RUN apk --purge del .build-deps

COPY . /app

CMD ["pipenv", "run", "dev"]
