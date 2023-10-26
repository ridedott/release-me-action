#!/usr/bin/env bash

set -ex

npm --prefix "$1" ci "$1" --no-audit --no-progress --prefer-offline

if [ "$#" -gt 1 ]; then
  # Install additional packages.
  npm --prefix "$1" install "$1" "${@:2}" --no-audit --no-progress --prefer-offline
fi
