FROM ubuntu:20.04
FROM node:12

WORKDIR /usr/src/app

COPY ./docker-start/ ./docker-start/
COPY ./src/ ./src/
COPY ./static/ ./static/
COPY ./.babelrc ./
COPY ./google-chrome-unstable_85.0.4173.0-1_amd64.deb ./
COPY ./package.json ./
COPY ./docker-install.sh ./
COPY ./yarn.lock ./

RUN ./docker-install.sh

CMD [ "./runtime-private/docker-start"]
