FROM node

WORKDIR /usr/src/service

COPY . .

RUN npm install

CMD ["npm", "start"]
