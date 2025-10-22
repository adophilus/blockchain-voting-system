FROM ghcr.io/foundry-rs/foundry AS foundry

FROM oven/bun:alpine AS base

ARG NODE_ENV

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache python3 make g++ bash nodejs
RUN bun add -g pnpm


# Copy Foundry binaries from the Foundry stage
COPY --from=foundry /usr/local/bin/forge /usr/local/bin/forge
COPY --from=foundry /usr/local/bin/cast /usr/local/bin/cast
COPY --from=foundry /usr/local/bin/anvil /usr/local/bin/anvil

FROM base AS build

WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod false && pnpm build:backend


FROM base AS deploy

WORKDIR /app

COPY --from=build /app ./

EXPOSE $PORT

CMD ["pnpm", "--filter", "@blockchain-voting-system/backend", "start"]
