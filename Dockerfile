FROM node:24-alpine
COPY . /usr/app
WORKDIR /usr/app
RUN npm install