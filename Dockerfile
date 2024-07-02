FROM node:latest

WORKDIR /app

COPY package.json ./

RUN npm i

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]