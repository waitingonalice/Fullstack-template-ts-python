FROM node:20-alpine as base

RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base as dev

COPY ./package.json ./yarn.lock /app/
RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY . /app/

FROM base as builder

COPY --from=dev /app /app
RUN yarn run build

# Production build strips out dev dependencies and only copies the necessary files
FROM base as prod

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public /app/public
# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone /app
COPY --from=builder --chown=nextjs:nodejs /app/.next/static /app/.next/static

USER nextjs

ENV HOSTNAME "0.0.0.0"
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
