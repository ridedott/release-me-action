#!/usr/bin/env sh

set -ex

# Workaround https://github.com/zeit/ncc/issues/457.
mv tsconfig.production.json tsconfig.temp.json
mv tsconfig.json tsconfig.json

ncc build src/index.ts \
--external @semantic-release/changelog \
--external @semantic-release/commit-analyzer \
--external @semantic-release/exec \
--external @semantic-release/git \
--external @semantic-release/github \
--external @semantic-release/npm \
--external @semantic-release/release-notes-generator \
--external semantic-release \
--minify \
--out dist \
--source-map

# Revert https://github.com/zeit/ncc/issues/457.
mv tsconfig.json tsconfig.production.json
mv tsconfig.temp.json tsconfig.json
