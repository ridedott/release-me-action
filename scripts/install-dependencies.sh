#!/usr/bin/env bash

set -ex

if [ "$#" -gt 1 ]; then
  # Install additional packages.
  npm --prefix "$1" install "$1" "${@:2}" --no-audit --no-progress --prefer-offline
fi
