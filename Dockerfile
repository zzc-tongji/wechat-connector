FROM ubuntu:20.04
FROM node:lts

WORKDIR /usr/src/app

COPY ./src/ ./src/
COPY ./static/ ./static/
COPY ./.babelrc ./
COPY ./package.json ./
COPY ./prerequisite.sh ./
COPY ./yarn.lock ./

RUN ./prerequisite.sh && mkdir runtime && yarn install --production && yarn start-install

CMD [ "yarn", "start" ]
