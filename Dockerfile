FROM ubuntu:20.04
FROM node:lts

WORKDIR /usr/src/app

COPY ./src/ ./src/
COPY ./static/ ./static/
COPY ./.babelrc ./
COPY ./google-chrome-unstable_85.0.4173.0-1_amd64.deb ./
COPY ./package.json ./
COPY ./prerequisite.sh ./
COPY ./yarn.lock ./

RUN ./prerequisite.sh && mkdir runtime && yarn install --production && yarn start-install

CMD [ "runtime/docker-start.sh"]
