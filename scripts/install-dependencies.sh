#!/usr/bin/env sh

npm --prefix "$1" ci "$1" --only=production --no-audit --no-progress --prefer-offline

packages=""
for (( i = 1; i < "$#"; i++ )); do
    packages+=" $i"
done

if [ "${#$}" -gt 1 ]; then
  # Install additional packages
  npm --prefix "$1" i "$1" "$packages" --no-audit --no-progress --prefer-offline
fi
