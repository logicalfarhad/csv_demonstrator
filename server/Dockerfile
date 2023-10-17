FROM node:14-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 80

CMD ["npm", "start"]