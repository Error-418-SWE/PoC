FROM node:20
WORKDIR ./app
COPY ./poc1/ ./
RUN npm install 
RUN npm install vite
RUN node server.js &
EXPOSE 5173 3000
CMD npx vite --host