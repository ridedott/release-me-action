#!/usr/bin/env bash

npm --prefix "$1" ci "$1" --only=production --no-audit --no-progress --prefer-offline
