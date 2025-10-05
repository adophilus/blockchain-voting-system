FROM oven/bun:alpine AS base

ARG NODE_ENV
ARG VITE_NODE_ENV
ARG VITE_BACKEND_URL

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache python3 make g++ bash nodejs
RUN bun add -g pnpm


FROM base AS build

WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm run build:docs


FROM base AS deploy

WORKDIR /app

COPY --from=build /app/apps/docs/docs/.vitepress/dist ./

CMD ["bunx", "zerv"]
