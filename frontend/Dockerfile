FROM node:20.11.0-slim

WORKDIR /src

COPY ./package.json ./yarn.lock /src/
RUN yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY . /src/

CMD ["yarn","run","dev"]
