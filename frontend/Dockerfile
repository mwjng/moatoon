FROM node:22.13.1-alpine

WORKDIR /src

COPY package.json .

RUN npm install 

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]