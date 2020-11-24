FROM node:9.11.2-alpine AS build

WORKDIR /home/node/app

COPY . .

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
	apk add ca-certificates  
RUN rm -rf /var/cache/apk/*
RUN apk --update add git
RUN apk --update add nodejs 
#RUN rm -rf /var/cache/apk/* && \
RUN npm i npm@latest -g
RUN npm install -g bower grunt-cli && \
	echo '{ "allow_root": true }' > /root/.bowerrc && \
	npm install -D grunt && \
	npm install 
RUN	bower cache clean && \
    bower install bootstrap#3.3.7
RUN	bower install -V -E --config.interactive=false

RUN grunt --force -v
RUN mkdir dist && mv mx min dependency images tracking fonts css csv dev saxs reports viewer bower_components index.html dist

FROM nginx:1.15.0-alpine

COPY --from=build /home/node/app/dist /usr/share/nginx/html
COPY assets/nginx.conf /etc/nginx/

EXPOSE 8084
