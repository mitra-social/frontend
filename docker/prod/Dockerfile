# build environment
FROM node:14-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install -g npm
COPY package.json /app/package.json
# Fix run prepare of activitypub-objects (https://github.com/npm/npm/issues/17346)
RUN npm config set unsafe-perm true && npm install --silent
RUN npm install @vue/cli@3.7.0 -g
COPY . /app
RUN npm run build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/prod/nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
