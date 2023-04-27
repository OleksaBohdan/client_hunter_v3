FROM node:19.8

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 3001

CMD ["npm", "start"]