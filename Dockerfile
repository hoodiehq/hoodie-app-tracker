FROM mhart/alpine-node:8

WORKDIR /app

ADD package.json ./
ADD ./public ./public
# ADD ./.hoodierc ./

RUN apk add --no-cache git && npm install --production --no-optional && \
    apk del git && \
    rm -rf /tmp/* /root/.npm

ENV hoodie_dbUrl http://admin:secret@couchdb:5984/

EXPOSE 8080

CMD ["npm", "start", "--", "--bind-address", "0.0.0.0"]
