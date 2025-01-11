# Imagem de Node dessa vez (ALELUIA IRMÕES)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# starta a instalação do Node
RUN npm install

COPY . .

EXPOSE 3000

# esse é o comando para rodar o Microsserviço
CMD [ "npm", "start" ]