FROM node:9.11.2-alpine AS build

WORKDIR /home/node/app

COPY ./package.json ./

COPY  . .

#RUN apk update && \
#apk add git && \
#npm install && npm install -g bower grunt && \
#bower install --allow-root && \
#bower install lodash --allow-root && \
#bower install zeroclipboard --allow-root && \
#bower install three --allow-root && \
#bower install uglymol --allow-root && \
#bower install jszip --allow-root && \
#grunt --force && \
#grunt dev --force && \
#bower list --allow-root

RUN apk update && \
apk add git && \ 
npm install

RUN apk --update add git nodejs && rm -rf /var/cache/apk/* && \
    npm install -g --save-dev bower grunt-cli grunt && \
    echo '{ "allow_root": true }' > /root/.bowerrc && \
    bower install && \
    grunt --force

FROM nginx:1.15.0-alpine

COPY --from=build /home/node/app/ /usr/share/nginx/html
COPY assets/nginx.conf /etc/nginx/

EXPOSE 8084