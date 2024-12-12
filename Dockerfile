# Usar a imagem oficial do Node.js
FROM node:16

# Definir o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copiar os arquivos de dependências
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos para dentro do contêiner
COPY . .

# Expor a porta 5000
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
