ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION} as base

WORKDIR /src

FROM base as development

COPY ./package.json ./yarn.lock /src/
RUN yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY . /src/

RUN yarn run build

# Production build strips out dev dependencies and only copies the necessary files
FROM base as production

COPY --from=development /src/.next /src/.next
COPY --from=development /src/package.json /src/package.json
COPY --from=development /src/public /src/public
COPY --from=development /src/next.config.mjs /src/next.config.mjs
COPY --from=development /src/node_modules /src/node_modules

CMD ["yarn","run","start"]
