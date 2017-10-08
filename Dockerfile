FROM node:8
RUN mkdir -p /usr/src/around-server
WORKDIR /usr/src/around-server
COPY package.json /usr/src/around-server
RUN npm install
COPY . /usr/src/around-server/
EXPOSE 443
CMD ["npm", "start"]