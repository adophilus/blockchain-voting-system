#! /usr/bin/env bash

tsc -b && \
vitepress build docs && \
rm -rf .vercel/output && \
mkdir -p .vercel/output && \
cp assets/vercel-config.json .vercel/output/config.json && \
cp -r docs/.vitepress/dist .vercel/output/static
