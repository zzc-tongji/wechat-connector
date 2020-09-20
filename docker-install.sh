#!/bin/sh

if [ $(cat /etc/os-release | grep -ci "debian\|ubuntu") -gt 0 ]; then
  apt-get update \
  && apt-get install -y curl \
  && apt-get install -y gcc \
  && apt-get install -y --no-install-recommends ./google-chrome-unstable_85.0.4173.0-1_amd64.deb \
  && mkdir runtime/ \
  && mkdir runtime-private/ \
  && yarn install --production \
  && yarn start-install \
  && cd docker-start/ \
  && gcc -include whereami.h -c whereami.c \
  && gcc -include whereami.h -c main.c \
  && gcc whereami.o main.o -static -o docker-start \
  && rm -f whereami.o \
  && rm -f main.o \
  && mv docker-start ../runtime-private/ \
  && cd ../
else
  echo "[Error] unsupported linux distribution"
  exit 1
fi
