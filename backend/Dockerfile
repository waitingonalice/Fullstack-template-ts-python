FROM python:3.11.0

WORKDIR /app

COPY ./Pipfile ./Pipfile.lock /app/
RUN pip install pipenv && pipenv install --deploy --ignore-pipfile

COPY . /app

CMD ["pipenv", "run", "dev"]
