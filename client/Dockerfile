FROM node:19.1.0
RUN apt-get update && apt-get install -y libaio1 unzip wget \
&& mkdir -p /opt/service \
&& cd /opt/service \
&& wget https://download.oracle.com/otn_software/linux/instantclient/2112000/el9/instantclient-basic-linux.x64-21.12.0.0.0dbru.el9.zip --no-check-certificate \
&& unzip instantclient-basic-linux.x64-21.12.0.0.0dbru.el9.zip \
&& rm instantclient-basic-linux.x64-21.12.0.0.0dbru.el9.zip

ENV LD_LIBRARY_PATH=/opt/service/instantclient_21_12

WORKDIR /opt/service
EXPOSE 3000
# COPY package*.json ./
# RUN npm install
COPY . /opt/service

ENTRYPOINT [ "npm", "run", "start:prod" ]
