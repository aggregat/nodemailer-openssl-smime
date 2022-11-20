ARG NODE_VERSION=18
ARG PYTHON_VERSION=3.11
# FROM node:$NODE_VERSION-alpine
FROM nikolaik/python-nodejs:python${PYTHON_VERSION}-nodejs${NODE_VERSION}-alpine AS buildstage

RUN apk add --update-cache \
    valgrind \
    build-base \
  && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
COPY . .

# RUN npm install -g prebuildify
RUN npm ci
RUN npm run build
RUN npm pack

RUN valgrind --trace-children=yes --leak-check=full --suppressions=valgrind.supp --log-file=valgrind.log --error-exitcode=1 npm test
RUN cat valgrind.log

FROM node:$NODE_VERSION-alpine AS runstage

WORKDIR /usr/src/app
COPY user .

 COPY --chown=node:node --from=buildstage /usr/src/app/openssl-napi-1.0.0.tgz .

RUN npm i openssl-napi-1.0.0.tgz

CMD ["npm", "start"]