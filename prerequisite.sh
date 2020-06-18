#!/bin/sh

# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
# https://github.com/ebidel/try-puppeteer/blob/master/backend/Dockerfile
# Install latest chrome dev package.
if [ $(cat /etc/os-release | grep -ci "debian\|ubuntu") -gt 0 ]; then
  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update && apt-get install -y --no-install-recommends google-chrome-unstable \
  && apt-get purge --auto-remove \
  && rm -rf /tmp/* /var/lib/apt/lists/* \
  && rm -rf /usr/bin/google-chrome* /opt/google/chrome-unstable
else
  echo "[Error] unsupported linux distribution"
  exit 1
fi
