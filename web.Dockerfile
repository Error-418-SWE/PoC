FROM node:20-alpine

WORKDIR /var/web
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 3000