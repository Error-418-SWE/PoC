FROM node:20
WORKDIR /var/express
COPY . .
RUN npm install 
EXPOSE 3001
CMD node server.js