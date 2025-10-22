#!/usr/bin/env bash

pnpm --filter @blockchain-voting-system/docs-openapi build && \
  pnpm --filter @blockchain-voting-system/api build
