#!/bin/sh

if [ $(cat /etc/os-release | grep -ci "debian\|ubuntu") -gt 0 ]; then
  apt-get update
  && apt-get install -y curl
  && apt-get install -y gcc
  && apt-get install -y make
  && apt-get install -y --no-install-recommends ./google-chrome-unstable_85.0.4173.0-1_amd64.deb
  && mkdir runtime/
  && yarn install --production
  && yarn start-install
  && cd src/docker-start/
  && ./compile.sh
  && cd ../../
else
  echo "[Error] unsupported linux distribution"
  exit 1
fi
