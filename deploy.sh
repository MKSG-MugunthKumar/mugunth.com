#!/usr/bin/env fish

# Clean up previous build
rm -rf node_modules public resources
rm go.mod go.sum
hugo mod init github.com/MKSG-MugunthKumar/mugunth.com
hugo mod get -u
npm ci
hugo --gc --minify

## Test Locally
hugo server -D --disableFastRender

## Deploy Resume PDF Generator Worker
cd resume-pdf-generator
wrangler deploy
