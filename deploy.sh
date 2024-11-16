#!/usr/bin/env fish

# Install dependencies
npm ci

# Update submodules
git submodule update --init --recursive

# Build the site
hugo --gc --minify

# Test locally
hugo server
