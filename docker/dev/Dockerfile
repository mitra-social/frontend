# base image
FROM node:14-alpine as build

RUN apk --no-cache upgrade && \
    apk add bash

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN npm install -g npm

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install @vue/cli@3.7.0 -g

# start app
CMD ["npm", "run", "serve"]
