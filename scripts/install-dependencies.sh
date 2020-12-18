#!/usr/bin/env sh

npm --prefix $1 ci $1 --only=production --no-audit --no-progress --prefer-offline

additional_packages=( "${@:2}" )

if [ "${#additional_packages}" -gt 0 ]; then
  # Install additional packages
  npm --prefix "$1" i "$1" "$additional_packages" --no-audit --no-progress --prefer-offline
fi
