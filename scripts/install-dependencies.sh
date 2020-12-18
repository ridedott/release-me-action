#!/usr/bin/env sh

npm --prefix $1 ci $1 --only=production --no-audit --no-progress --prefer-offline

if [ "$#" -gt 1 ]; then
  # Install additional packages
  npm --prefix $1 i $1 ${@:2} --no-audit --no-progress --prefer-offline
fi
