#!/usr/bin/env fish

# Clean up previous build
rm -rf node_modules public resources

# Install dependencies
npm ci
git submodule update --init --recursive
hugo --gc --minify

## Test Locally
hugo server -D --disableFastRender

## Deploy Resume PDF Generator Worker
cd resume-pdf-generator
wrangler deploy
