# Definir a imagem base para o Node.js. Escolha a versão do Node que é compatível com sua aplicação.
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container. Este será o diretório base para sua aplicação.
WORKDIR /app

# Copiar os arquivos de definição de dependências para o diretório de trabalho.
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Comando para executar sua aplicação.
CMD ["npm", "start"]
