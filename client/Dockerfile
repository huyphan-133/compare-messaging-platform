FROM node:19.1.0

WORKDIR /opt/service
EXPOSE 3000
COPY package*.json ./
RUN npm install -f
COPY . /opt/service

ENTRYPOINT [ "npm", "run", "start:prod" ]
