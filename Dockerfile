FROM node:lts-alpine3.23
CMD ["npm", "run", "start:dev"]
COPY . /usr/app
WORKDIR /usr/app
RUN npm install