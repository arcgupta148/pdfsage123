FROM node:18-alpine AS build

WORKDIR /app
#Copying the package json and package-lock json to docker Image
COPY package.json package-lock.json ./

COPY . . 

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]