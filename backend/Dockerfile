FROM python:3.11.0

WORKDIR /src

COPY ./Pipfile ./Pipfile.lock /src/
RUN pip install pipenv && pipenv install --deploy --ignore-pipfile

COPY . /src

CMD ["pipenv", "run", "dev"]
