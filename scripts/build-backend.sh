#!/usr/bin/env bash

pnpm --filter @blockchain-voting-system/contracts build && \
  pnpm --filter @blockchain-voting-system/core build && \
    pnpm --filter @blockchain-voting-system/backend build
