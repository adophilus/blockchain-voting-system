FROM oven/bun:alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache python3 make g++ bash nodejs
RUN bun add -g pnpm

COPY . /app
WORKDIR /app

RUN pnpm install --prod false --frozen-lockfile
RUN pnpm run build

EXPOSE $PORT

CMD [ "pnpm", "start:frontend" ]