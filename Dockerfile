FROM node:lts-alpine3.23
RUN npm install
COPY . /usr/app
WORKDIR /usr/app