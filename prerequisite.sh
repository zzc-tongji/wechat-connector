#!/bin/sh

if [ $(cat /etc/os-release | grep -ci "debian\|ubuntu") -gt 0 ]; then
  apt-get update && apt-get install -y curl && apt-get install -y --no-install-recommends ./google-chrome-unstable_85.0.4173.0-1_amd64.deb
else
  echo "[Error] unsupported linux distribution"
  exit 1
fi
