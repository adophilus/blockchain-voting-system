FROM oven/bun:alpine AS base

ARG NODE_ENV

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache python3 make g++ bash nodejs
RUN bun add -g pnpm


FROM base AS build

WORKDIR /app
COPY . .
RUN ls -lah
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod false \
  && pnpm build


FROM base AS deploy

WORKDIR /app

COPY --from=build /app ./

EXPOSE $PORT

CMD ["pnpm", "start:backend"]
