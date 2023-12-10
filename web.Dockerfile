FROM node:18.16.0-alpine3.17

WORKDIR /var/app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 3000